const { ObjectId } = require("mongodb");
const { getDb } = require("../config/db");

/* =========================
   CREATE ENROLLMENT
========================= */
exports.createEnrollment = async (req, res) => {
  try {
    const { courseId } = req.body;
    const userId = req.user.id;

    const db = getDb();
    const enrollments = db.collection("enrollments");

    const exists = await enrollments.findOne({
      userId: new ObjectId(userId),
      courseId: new ObjectId(courseId),
    });

    if (exists) {
      return res.status(400).json({ message: "Already enrolled" });
    }

    const result = await enrollments.insertOne({
      userId: new ObjectId(userId),
      courseId: new ObjectId(courseId),
      paymentStatus: "pending",
      status: "inactive",
      progress: 0,
      createdAt: new Date(),
    });

    res.status(201).json({
      success: true,
      enrollmentId: result.insertedId,
    });
  } catch (error) {
    console.error("Enrollment error:", error);
    res.status(500).json({ message: "Enrollment failed" });
  }
};

/* =========================
   GET MY ENROLLMENTS (STUDENT)
========================= */
exports.getMyEnrollments = async (req, res) => {
  try {
    const userId = req.user.id;
    const db = getDb();

    const enrollments = await db
      .collection("enrollments")
      .aggregate([
        {
          $match: {
            userId: new ObjectId(userId),
          },
        },
        {
          $lookup: {
            from: "courses",
            localField: "courseId",
            foreignField: "_id",
            as: "course",
          },
        },
        { $unwind: "$course" },
      ])
      .toArray();

    res.json(enrollments);
  } catch (error) {
    console.error("Get enrollments error:", error);
    res.status(500).json({ message: "Failed to fetch enrollments" });
  }
};
