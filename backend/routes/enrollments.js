const express = require("express");
const router = express.Router();

const enrollmentController = require("../controllers/enrollmentController");
const { authenticate } = require("../middleware/auth"); // ✅ তোমার auth.js অনুযায়ী

// Create new enrollment
// POST /api/enrollments
router.post("/", authenticate, enrollmentController.createEnrollment);

// Get logged-in user's enrollments
// GET /api/enrollments/my-enrollments
router.get(
  "/my-enrollments",
  authenticate,
  enrollmentController.getMyEnrollments
);

// Get single enrollment by ID
// GET /api/enrollments/:id
router.get("/:id", authenticate, enrollmentController.getEnrollmentById);

// Update course progress
// PUT /api/enrollments/:id/progress
router.put(
  "/:id/progress",
  authenticate,
  enrollmentController.updateProgress
);

module.exports = router;
