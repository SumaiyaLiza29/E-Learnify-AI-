const { getDB } = require('../config/db');
const { ObjectId } = require('mongodb');

// সব courses নিয়ে আসা (public)
exports.getAllCourses = async (req, res) => {
  try {
    const db = getDB();
    const coursesCollection = db.collection('courses');
    
    const courses = await coursesCollection
      .find({})
      .sort({ createdAt: -1 })
      .toArray();
    
    res.json(courses);
  } catch (error) {
    console.error('Get courses error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// একটা course এর details
exports.getCourseById = async (req, res) => {
  try {
    const { id } = req.params;
    const db = getDB();
    const coursesCollection = db.collection('courses');
    
    const course = await coursesCollection.findOne({ _id: new ObjectId(id) });
    
    if (!course) {
      return res.status(404).json({ message: 'Course পাওয়া যায়নি' });
    }
    
    res.json(course);
  } catch (error) {
    console.error('Get course error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// নতুন course তৈরি (instructor/admin only)
exports.createCourse = async (req, res) => {
  try {
    const { title, description, price, duration, category, tags } = req.body;
    
    // Validation
    if (!title || !description || !price) {
      return res.status(400).json({ message: 'সব field পূরণ করুন' });
    }
    
    const db = getDB();
    const coursesCollection = db.collection('courses');
    
    const newCourse = {
      title,
      description,
      price: parseFloat(price),
      duration: duration ? parseInt(duration) : 0,
      category: category || 'General',
      tags: tags || [],
      instructorId: new ObjectId(req.user.userId),
      instructorName: req.user.name || 'Unknown',
      videoUrl: '',
      thumbnailUrl: '',
      enrolledStudents: [],
      createdAt: new Date()
    };
    
    const result = await coursesCollection.insertOne(newCourse);
    
    res.status(201).json({
      message: 'Course তৈরি সফল হয়েছে',
      courseId: result.insertedId
    });
    
  } catch (error) {
    console.error('Create course error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Course update (instructor/admin only)
exports.updateCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const db = getDB();
    const coursesCollection = db.collection('courses');
    
    // Check if course exists
    const course = await coursesCollection.findOne({ _id: new ObjectId(id) });
    
    if (!course) {
      return res.status(404).json({ message: 'Course পাওয়া যায়নি' });
    }
    
    // Check if user is the instructor or admin
    if (course.instructorId.toString() !== req.user.userId && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'আপনার permission নেই' });
    }
    
    const updateData = {
      ...req.body,
      updatedAt: new Date()
    };
    
    await coursesCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );
    
    res.json({ message: 'Course update সফল হয়েছে' });
    
  } catch (error) {
    console.error('Update course error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Course delete (admin only)
exports.deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const db = getDB();
    const coursesCollection = db.collection('courses');
    
    await coursesCollection.deleteOne({ _id: new ObjectId(id) });
    
    res.json({ message: 'Course delete হয়েছে' });
    
  } catch (error) {
    console.error('Delete course error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Instructor এর নিজের courses
exports.getInstructorCourses = async (req, res) => {
  try {
    const db = getDB();
    const coursesCollection = db.collection('courses');
    
    const courses = await coursesCollection
      .find({ instructorId: new ObjectId(req.user.userId) })
      .sort({ createdAt: -1 })
      .toArray();
    
    res.json(courses);
  } catch (error) {
    console.error('Get instructor courses error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};