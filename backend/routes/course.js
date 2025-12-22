const express = require("express");
const router = express.Router();
const courseController = require("../controllers/courseController");

// PUBLIC (login থাকুক বা না থাকুক course দেখাবে)
router.get("/", courseController.getAllCourses);
router.get("/:id", courseController.getCourseById);

module.exports = router;
