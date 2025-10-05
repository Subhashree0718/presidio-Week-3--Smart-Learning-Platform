const pool = require('../utils/db');
const Course = {
  getAll: async (filter, sort, page, limit) => {
    let query = 'SELECT * FROM course';
    const conditions = [];
    if (filter.category) conditions.push(`course_category='${filter.category}'`);
    if (conditions.length) query += ' WHERE ' + conditions.join(' AND ');
    if (sort) query += ` ORDER BY course_rating ${sort === 'rating_desc' ? 'DESC' : 'ASC'}`;
    if (page && limit) query += ` LIMIT ${limit} OFFSET ${(page - 1) * limit}`;
    const res = await pool.query(query);
    return res.rows;
  },
  getById: async (id) => {
    const res = await pool.query('SELECT * FROM course WHERE course_id=$1', [id]);
    return res.rows[0];
  },
  create: async (course) => {
    const res = await pool.query(
      'INSERT INTO course (course_title, course_description, course_category, course_rating, teacher_id) VALUES ($1,$2,$3,$4,$5) RETURNING *',
      [course.course_title, course.course_description, course.course_category, course.course_rating, course.teacher_id]
    );
    return res.rows[0];
  },
  enrollStudent: async (courseId, studentId) => {
    const res = await pool.query(
      'INSERT INTO enrollment (course_id, enrollment_student_id) VALUES ($1, $2) RETURNING *',
      [courseId, studentId]
    );
    return res.rows[0];
  }
};
module.exports = Course;
