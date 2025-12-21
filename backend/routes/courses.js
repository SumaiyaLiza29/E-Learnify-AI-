const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');
const { authenticate, authorize } = require('../middleware/auth');

// Public routes
router.get('/', courseController.getAllCourses);

// Instructor's own courses (MUST be before :id)
router.get(
  '/my/courses',
  authenticate,
  authorize(['instructor']),
  courseController.getInstructorCourses
);

// Single course by ID
router.get('/:id', courseController.getCourseById);

// Protected routes (instructor/admin)
router.post(
  '/',
  authenticate,
  authorize(['instructor', 'admin']),
  courseController.createCourse
);

router.put(
  '/:id',
  authenticate,
  authorize(['instructor', 'admin']),
  courseController.updateCourse
);

router.delete(
  '/:id',
  authenticate,
  authorize(['admin']),
  courseController.deleteCourse
);

module.exports = router;
