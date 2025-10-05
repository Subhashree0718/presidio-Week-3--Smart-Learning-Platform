const User = require('../models/userModel');
const pool = require('../utils/db');

// Get all users of a specific role (student or teacher)
const getUsersByRole = async (req, res) => {
    const { role } = req.params;
    if (!['student', 'teacher'].includes(role)) {
        return res.status(400).json({ message: 'Invalid role specified' });
    }
    try {
        const users = await User.findByRole(role);
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Create a new user (student or teacher) with security checks
const createUser = async (req, res) => {
    // Security check: Teachers can only create students.
    if (req.user.role === 'teacher' && req.body.role !== 'student') {
        return res.status(403).json({ message: 'Forbidden: Teachers can only create students.' });
    }
    try {
        const newUser = await User.create(req.body);
        res.status(201).json(newUser);
    } catch (err) {
        if (err.code === '23505') {
            return res.status(409).json({ message: 'An account with this email already exists.' });
        }
        res.status(500).json({ error: err.message });
    }
};

// Update a user with security checks
const updateUser = async (req, res) => {
    const { id } = req.params;
    // Security check: Teachers can only update students.
    if (req.user.role === 'teacher') {
        const userToUpdate = await User.getById(id);
        if (userToUpdate && userToUpdate.user_role !== 'student') {
             return res.status(403).json({ message: 'Forbidden: Teachers can only update students.' });
        }
    }
    try {
        const updatedUser = await User.update(id, req.body);
        if (!updatedUser) return res.status(404).json({ message: "User not found" });
        res.json(updatedUser);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Delete a user with security checks
const deleteUser = async (req, res) => {
    const { id } = req.params;
    // Security check: Teachers can only delete students.
     if (req.user.role === 'teacher') {
        const userToDelete = await User.getById(id);
        if (userToDelete && userToDelete.user_role !== 'student') {
             return res.status(403).json({ message: 'Forbidden: Teachers can only delete students.' });
        }
    }
    try {
        await User.delete(id);
        res.status(204).send(); // No Content
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get Analytics Data
const getAnalytics = async (req, res) => {
    try {
        const studentCountRes = await pool.query("SELECT COUNT(*) FROM a_user WHERE user_role = 'student'");
        const teacherCountRes = await pool.query("SELECT COUNT(*) FROM a_user WHERE user_role = 'teacher'");
        const courseCountRes = await pool.query("SELECT COUNT(*) FROM course");
        const studentsByAgeRes = await pool.query("SELECT age, COUNT(*) as count FROM a_user WHERE user_role = 'student' AND age IS NOT NULL GROUP BY age ORDER BY age");
        const recentStudentsRes = await pool.query("SELECT user_name, user_email, created_at FROM a_user WHERE user_role = 'student' ORDER BY created_at DESC LIMIT 5");

        res.json({
            totalStudents: parseInt(studentCountRes.rows[0].count),
            totalTeachers: parseInt(teacherCountRes.rows[0].count),
            totalCourses: parseInt(courseCountRes.rows[0].count),
            studentsByAge: studentsByAgeRes.rows,
            recentStudents: recentStudentsRes.rows
        });
    } catch(err) {
        res.status(500).json({ error: err.message });
    }
};

const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const newUserPayload = { name, email, password, role: 'student' };
        const newUser = await User.create(newUserPayload);
        res.status(201).json(newUser);
    } catch (err) {
        if (err.code === '23505') {
            return res.status(409).json({ message: 'An account with this email already exists.' });
        }
        res.status(500).json({ error: err.message });
    }
};


module.exports = {
    getUsersByRole,
    createUser,
    updateUser,
    deleteUser,
    getAnalytics,
    registerUser
};