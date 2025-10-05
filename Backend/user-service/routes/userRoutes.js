const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const userController = require('../controllers/userController');
const { authenticateJWT, authorizeRoles } = require('../middleware/auth');

// --- Authentication Routes ---
router.post('/login', authController.login);
router.get('/refresh', authController.refresh);
router.post('/logout', authController.logout);
router.post('/register', userController.registerUser);

// --- User Management Routes ---

// GET: Admins can get students/teachers. Teachers can get students.
router.get('/:role', authenticateJWT, authorizeRoles('admin', 'teacher'), userController.getUsersByRole);

// POST: Admins can create any user. Teachers can create students.
router.post('/', authenticateJWT, authorizeRoles('admin', 'teacher'), userController.createUser);

// PUT: Admins can update any user. Teachers can update students.
router.put('/:id', authenticateJWT, authorizeRoles('admin', 'teacher'), userController.updateUser);

// DELETE: Admins can delete any user. Teachers can delete students.
router.delete('/:id', authenticateJWT, authorizeRoles('admin', 'teacher'), userController.deleteUser);


// --- Analytics Route ---
router.get('/data/analytics', authenticateJWT, authorizeRoles('admin'), userController.getAnalytics);

module.exports = router;