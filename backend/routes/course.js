const express = require("express");
const router = express.Router();
const { ObjectId } = require("mongodb");

const upload = require("../middleware/upload");
const { authenticate, authorize } = require("../middleware/auth");
const {
  createCourse,
  getAllCourses,
} = require("../controllers/courseController");
const { getDb } = require("../config/db");

// ✅ GET ALL COURSES
router.get("/", getAllCourses);

// ✅ GET SINGLE COURSE (🔥 REQUIRED FOR VIEW DETAILS)
router.get("/:id", async (req, res) => {
  try {
    const course = await getDb()
      .collection("courses")
      .findOne({ _id: new ObjectId(req.params.id) });

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    res.json(course);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch course" });
  }
});

// ✅ CREATE COURSE
router.post(
  "/",
  authenticate,
  authorize("instructor"),
  upload.single("thumbnail"),
  createCourse
);


module.exports = router;
