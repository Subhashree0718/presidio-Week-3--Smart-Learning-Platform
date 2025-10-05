// controllers/courseController.js
const Course = require('../models/courseModel');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const pool = require('../utils/db');

const getCourses = async (req, res) => {
  const { page = 1, limit = 5, category, sort } = req.query;
  try {
    // fetch list
    const courses = await Course.getAll({ category }, sort, page, limit);

    // total count for pagination
    const countQuery = `SELECT COUNT(*) as total FROM course ${category ? `WHERE course_category='${category}'` : ''}`;
    const countRes = await pool.query(countQuery);
    const total = Number(countRes.rows[0].total);

    // attach teacher details
    const coursesWithTeacher = await Promise.all(courses.map(async c => {
      try {
const teacherRes = await axios.get(`${USER_SERVICE_URL}/users/${c.teacher_id}`);
        return {
          ...c,
          teacher: teacherRes.data,
          links: {
            self: `/courses/${c.course_id}`,
            enroll: `/courses/${c.course_id}/enroll`
          }
        };
      } catch {
        return {
          ...c,
          teacher: null,
          links: {
            self: `/courses/${c.course_id}`,
            enroll: `/courses/${c.course_id}/enroll`
          }
        };
      }
    }));

    const totalPages = Math.ceil(total / limit);
    const currentPage = Number(page);

    const topLevelLinks = {
      self: `/courses?page=${currentPage}&limit=${limit}`,
      next: currentPage < totalPages ? `/courses?page=${currentPage + 1}&limit=${limit}` : null,
      prev: currentPage > 1 ? `/courses?page=${currentPage - 1}&limit=${limit}` : null
    };

    res.json({
      page: currentPage,
      limit: Number(limit),
      total,
      totalPages,
      links: topLevelLinks,
      courses: coursesWithTeacher
    });
  } catch (err) {
    fs.appendFileSync(path.join(__dirname, '../logs/app.log'), `[ERROR] ${new Date().toISOString()} | ${err.message}\n`);
    res.status(500).json({ error: err.message });
  }
};
const getEnrolledCourses = async (req, res) => {
    const { studentId } = req.params;
    try {
        const query = `
            SELECT c.* FROM course c
            JOIN enrollment e ON c.course_id = e.course_id
            WHERE e.enrollment_student_id = $1
        `;
        const result = await pool.query(query, [studentId]);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};



const createCourse = async (req, res) => {
  try {
    const newCourse = await Course.create(req.body);
    res.status(201).json(newCourse);
  } catch (err) {
    fs.appendFileSync(path.join(__dirname, '../logs/app.log'), `[ERROR] ${new Date().toISOString()} | ${err.message}\n`);
    res.status(500).json({ error: err.message });
  }
};

const enrollStudent = async (req, res) => {
  try {
    const { courseId } = req.params;
    const studentId = req.body.studentId;
    const enrollment = await Course.enrollStudent(courseId, studentId);
    res.status(201).json(enrollment);
  } catch (err) {
    fs.appendFileSync(path.join(__dirname, '../logs/app.log'), `[ERROR] ${new Date().toISOString()} | ${err.message}\n`);
    res.status(500).json({ error: err.message });
  }
};

const getRecommendations = (req, res) => {
  const mockData = require('../mockCourses.json');
  res.json(mockData);
};

const getRecommendationsAsync = async (req, res) => {
  try {
    const mockData = require('../mockCourses.json');
    res.json(mockData);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getCourses, createCourse, enrollStudent, getRecommendations, getRecommendationsAsync ,getEnrolledCourses
};
