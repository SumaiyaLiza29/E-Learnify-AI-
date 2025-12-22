const { ObjectId } = require("mongodb");
const { getDb } = require("../config/db");

/* =========================
   GET ALL COURSES (PUBLIC)
========================= */
exports.getAllCourses = async (req, res) => {
  try {
    const db = getDb();
    const courses = await db
      .collection("courses")
      .find({})
      .toArray();

    res.json(courses);
  } catch (error) {
    console.error("Get courses error:", error);
    res.status(500).json({ message: "Failed to fetch courses" });
  }
};

/* =========================
   GET COURSE BY ID
========================= */
exports.getCourseById = async (req, res) => {
  try {
    const db = getDb();
    const course = await db
      .collection("courses")
      .findOne({ _id: new ObjectId(req.params.id) });

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    res.json(course);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch course" });
  }
};
