const { getDB } = require("../config/db");
const { ObjectId } = require("mongodb");

/**
 * Create new enrollment
 * POST /api/enrollments
 */
exports.createEnrollment = async (req, res) => {
  try {
    const { courseId } = req.body;
    const userId = req.user.userId;

    if (!courseId) {
      return res.status(400).json({ message: "Course ID is required" });
    }

    const db = getDB();

    const courses = db.collection("courses");
    const enrollments = db.collection("enrollments");
    const users = db.collection("users");

    // Check course exists
    const course = await courses.findOne({ _id: new ObjectId(courseId) });
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Check already enrolled
    const exists = await enrollments.findOne({
      studentId: new ObjectId(userId),
      courseId: new ObjectId(courseId),
    });

    if (exists) {
      return res.status(400).json({ message: "Already enrolled" });
    }

    // Get user info
    const user = await users.findOne({ _id: new ObjectId(userId) });

    const enrollment = {
      studentId: new ObjectId(userId),
      studentName: user?.name || "",
      studentEmail: user?.email || "",
      courseId: new ObjectId(courseId),
      courseTitle: course.title,
      coursePrice: course.price || 0,
      paymentStatus: "pending",
      progress: 0,
      enrollmentDate: new Date(),
      completionDate: null,
      certificateUrl: null,
    };

    const result = await enrollments.insertOne(enrollment);

    res.status(201).json({
      message: "Enrollment created successfully",
      enrollmentId: result.insertedId,
    });
  } catch (error) {
    console.error("Create enrollment error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * Get logged-in user's enrollments
 * GET /api/enrollments/my-enrollments
 */
exports.getMyEnrollments = async (req, res) => {
  try {
    const userId = req.user.userId;
    const db = getDB();

    const enrollments = await db
      .collection("enrollments")
      .find({ studentId: new ObjectId(userId) })
      .sort({ enrollmentDate: -1 })
      .toArray();

    res.json(enrollments);
  } catch (error) {
    console.error("Get enrollments error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * Get enrollment by ID
 * GET /api/enrollments/:id
 */
exports.getEnrollmentById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const db = getDB();
    const enrollment = await db.collection("enrollments").findOne({
      _id: new ObjectId(id),
      studentId: new ObjectId(userId),
    });

    if (!enrollment) {
      return res.status(404).json({ message: "Enrollment not found" });
    }

    res.json(enrollment);
  } catch (error) {
    console.error("Get enrollment error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * Update course progress
 * PUT /api/enrollments/:id/progress
 */
exports.updateProgress = async (req, res) => {
  try {
    const { id } = req.params;
    const { progress } = req.body;
    const userId = req.user.userId;

    if (progress === undefined) {
      return res.status(400).json({ message: "Progress is required" });
    }

    const db = getDB();
    const enrollments = db.collection("enrollments");

    const enrollment = await enrollments.findOne({
      _id: new ObjectId(id),
      studentId: new ObjectId(userId),
    });

    if (!enrollment) {
      return res.status(404).json({ message: "Enrollment not found" });
    }

    const update = {
      progress: Number(progress),
      updatedAt: new Date(),
    };

    // If completed
    if (Number(progress) === 100) {
      update.completionDate = new Date();
    }

    await enrollments.updateOne(
      { _id: new ObjectId(id) },
      { $set: update }
    );

    res.json({ message: "Progress updated successfully" });
  } catch (error) {
    console.error("Update progress error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
