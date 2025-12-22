// controllers/instructorController.js
const { getDB } = require("../config/db");
const { ObjectId } = require("mongodb");

/**
 * Get instructor's own courses with enrollment stats
 * GET /api/instructor/courses
 */
exports.getInstructorCourses = async (req, res) => {
  try {
    const instructorId = req.user.userId;
    const db = getDB();
    
    const courses = await db.collection('courses')
      .aggregate([
        {
          $match: { 
            instructorId: new ObjectId(instructorId) 
          }
        },
        {
          $lookup: {
            from: 'enrollments',
            localField: '_id',
            foreignField: 'courseId',
            as: 'enrollments'
          }
        },
        {
          $lookup: {
            from: 'users',
            localField: 'instructorId',
            foreignField: '_id',
            as: 'instructor'
          }
        },
        {
          $unwind: {
            path: '$instructor',
            preserveNullAndEmptyArrays: true
          }
        },
        {
          $project: {
            _id: 1,
            title: 1,
            description: 1,
            category: 1,
            price: 1,
            thumbnail: 1,
            duration: 1,
            level: 1,
            status: 1,
            createdAt: 1,
            updatedAt: 1,
            instructorName: '$instructor.name',
            instructorEmail: '$instructor.email',
            // Count enrollments
            totalEnrollments: { $size: '$enrollments' },
            // Count only paid enrollments
            paidEnrollments: {
              $size: {
                $filter: {
                  input: '$enrollments',
                  as: 'enrollment',
                  cond: { $eq: ['$$enrollment.paymentStatus', 'completed'] }
                }
              }
            },
            // Calculate earnings
            totalEarnings: {
              $multiply: [
                '$price',
                {
                  $size: {
                    $filter: {
                      input: '$enrollments',
                      as: 'enrollment',
                      cond: { $eq: ['$$enrollment.paymentStatus', 'completed'] }
                    }
                  }
                }
              ]
            }
          }
        },
        {
          $sort: { createdAt: -1 }
        }
      ])
      .toArray();
    
    res.json({
      success: true,
      count: courses.length,
      courses
    });
    
  } catch (error) {
    console.error('Get instructor courses error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to fetch courses',
      error: error.message 
    });
  }
};

/**
 * Get instructor dashboard statistics
 * GET /api/instructor/dashboard-stats
 */
exports.getInstructorDashboardStats = async (req, res) => {
  try {
    const instructorId = req.user.userId;
    const db = getDB();
    
    const courses = await db.collection('courses')
      .aggregate([
        {
          $match: { 
            instructorId: new ObjectId(instructorId) 
          }
        },
        {
          $lookup: {
            from: 'enrollments',
            localField: '_id',
            foreignField: 'courseId',
            as: 'enrollments'
          }
        },
        {
          $project: {
            title: 1,
            price: 1,
            enrollments: 1,
            paidEnrollments: {
              $filter: {
                input: '$enrollments',
                as: 'enrollment',
                cond: { $eq: ['$$enrollment.paymentStatus', 'completed'] }
              }
            }
          }
        }
      ])
      .toArray();
    
    // Calculate statistics
    const totalCourses = courses.length;
    const totalEnrollments = courses.reduce((sum, course) => sum + course.enrollments.length, 0);
    const totalPaidEnrollments = courses.reduce((sum, course) => sum + course.paidEnrollments.length, 0);
    const totalEarnings = courses.reduce((sum, course) => {
      return sum + (course.price * course.paidEnrollments.length);
    }, 0);
    
    // Get recent enrollments (last 7 days)
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    const recentEnrollments = await db.collection('enrollments')
      .aggregate([
        {
          $match: {
            courseId: { 
              $in: courses.map(course => course._id) 
            },
            paymentStatus: 'completed',
            enrolledAt: { $gte: oneWeekAgo }
          }
        },
        {
          $lookup: {
            from: 'courses',
            localField: 'courseId',
            foreignField: '_id',
            as: 'course'
          }
        },
        {
          $unwind: '$course'
        },
        {
          $lookup: {
            from: 'users',
            localField: 'studentId',
            foreignField: '_id',
            as: 'student'
          }
        },
        {
          $unwind: '$student'
        },
        {
          $project: {
            _id: 1,
            studentName: '$student.name',
            courseTitle: '$course.title',
            amount: '$course.price',
            enrolledAt: 1
          }
        },
        {
          $sort: { enrolledAt: -1 }
        },
        {
          $limit: 10
        }
      ])
      .toArray();
    
    // Get top performing courses
    const topCourses = courses
      .map(course => ({
        title: course.title,
        enrollments: course.enrollments.length,
        paidEnrollments: course.paidEnrollments.length,
        earnings: course.price * course.paidEnrollments.length
      }))
      .sort((a, b) => b.earnings - a.earnings)
      .slice(0, 5);
    
    res.json({
      success: true,
      stats: {
        totalCourses,
        totalEnrollments,
        totalPaidEnrollments,
        totalEarnings,
        recentEnrollments: recentEnrollments.length,
        averageEarningsPerCourse: totalCourses > 0 ? totalEarnings / totalCourses : 0
      },
      recentEnrollments,
      topCourses
    });
    
  } catch (error) {
    console.error('Get instructor stats error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to fetch dashboard stats',
      error: error.message 
    });
  }
};

/**
 * Get instructor earnings report
 * GET /api/instructor/earnings-report
 */
exports.getInstructorEarningsReport = async (req, res) => {
  try {
    const instructorId = req.user.userId;
    const { period = 'monthly' } = req.query; // monthly, weekly, yearly
    const db = getDB();
    
    // Get all instructor courses
    const instructorCourses = await db.collection('courses')
      .find({ instructorId: new ObjectId(instructorId) })
      .project({ _id: 1, title: 1, price: 1 })
      .toArray();
    
    const courseIds = instructorCourses.map(course => course._id);
    
    // Get enrollments for these courses
    const enrollments = await db.collection('enrollments')
      .aggregate([
        {
          $match: {
            courseId: { $in: courseIds },
            paymentStatus: 'completed'
          }
        },
        {
          $lookup: {
            from: 'courses',
            localField: 'courseId',
            foreignField: '_id',
            as: 'course'
          }
        },
        {
          $unwind: '$course'
        },
        {
          $project: {
            courseId: 1,
            courseTitle: '$course.title',
            amount: '$course.price',
            enrolledAt: 1,
            studentId: 1,
            paymentStatus: 1
          }
        },
        {
          $sort: { enrolledAt: -1 }
        }
      ])
      .toArray();
    
    // Calculate earnings by period
    let earningsByPeriod = {};
    const now = new Date();
    
    if (period === 'monthly') {
      // Last 12 months
      for (let i = 0; i < 12; i++) {
        const month = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const monthName = month.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
        earningsByPeriod[monthName] = 0;
      }
      
      enrollments.forEach(enrollment => {
        const enrollmentDate = new Date(enrollment.enrolledAt);
        const monthName = enrollmentDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
        if (earningsByPeriod[monthName] !== undefined) {
          earningsByPeriod[monthName] += enrollment.amount;
        }
      });
    } else if (period === 'weekly') {
      // Last 8 weeks
      for (let i = 0; i < 8; i++) {
        const weekStart = new Date(now);
        weekStart.setDate(now.getDate() - (7 * i));
        const weekLabel = `Week ${i + 1}`;
        earningsByPeriod[weekLabel] = 0;
      }
    }
    
    // Calculate total earnings
    const totalEarnings = enrollments.reduce((sum, enrollment) => sum + enrollment.amount, 0);
    
    // Calculate earnings by course
    const earningsByCourse = {};
    enrollments.forEach(enrollment => {
      if (!earningsByCourse[enrollment.courseTitle]) {
        earningsByCourse[enrollment.courseTitle] = 0;
      }
      earningsByCourse[enrollment.courseTitle] += enrollment.amount;
    });
    
    res.json({
      success: true,
      period,
      totalEarnings,
      totalEnrollments: enrollments.length,
      earningsByPeriod,
      earningsByCourse,
      recentTransactions: enrollments.slice(0, 20)
    });
    
  } catch (error) {
    console.error('Get earnings report error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to fetch earnings report',
      error: error.message 
    });
  }
};