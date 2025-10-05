const express = require('express');
const router = express.Router();
const { getCourses, createCourse, enrollStudent, getRecommendations, getRecommendationsAsync } = require('../controllers/courseController');
const { authenticateJWT, authorizeRoles } = require('../middleware/auth');
const apiKeyAuth = require('../middleware/apiKeyAuth');
const recommendationsLimiter = require('../middleware/rateLimiter');
const { getEnrolledCourses } = require('../controllers/courseController');

router.get('/', getCourses);
router.post('/', authenticateJWT, authorizeRoles('teacher','admin'), createCourse);
router.post('/:courseId/enroll', authenticateJWT, authorizeRoles('student'), enrollStudent);
router.get('/recommendations', recommendationsLimiter, getRecommendations);
router.get('/recommendations-async', recommendationsLimiter, getRecommendationsAsync);
router.get('/analytics', authenticateJWT, authorizeRoles('admin'), apiKeyAuth, (req,res)=> res.json({ message: 'Analytics data' }));
router.get('/enrolled/:studentId', authenticateJWT, authorizeRoles('student', 'admin'), getEnrolledCourses);

module.exports = router;
