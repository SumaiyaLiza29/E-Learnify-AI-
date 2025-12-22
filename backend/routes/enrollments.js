const express = require("express");
const router = express.Router();
const enrollmentController = require("../controllers/enrollmentController");
const { authenticate } = require("../middleware/auth");

router.post("/", authenticate, enrollmentController.createEnrollment);
router.get(
  "/my-enrollments",
  authenticate,
  enrollmentController.getMyEnrollments
);

module.exports = router;
