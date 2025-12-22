// routes/instructor.js
const express = require('express');
const router = express.Router();
const instructorController = require('../controllers/instructorController');
const { authenticate, isInstructor } = require('../middleware/auth');

// Apply authentication and instructor check to all routes
router.use(authenticate);
router.use(isInstructor); // This checks if user role is 'instructor'

// Get instructor's courses
router.get('/courses', instructorController.getInstructorCourses);

// Get dashboard statistics
router.get('/dashboard-stats', instructorController.getInstructorDashboardStats);

// Get earnings report
router.get('/earnings-report', instructorController.getInstructorEarningsReport);

module.exports = router;