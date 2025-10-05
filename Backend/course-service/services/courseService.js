const Course = require('../models/courseModel');
const User = require('../models/userModel');

const getAllCourses = async ({ page=1, limit=5, category, sort }) => {
  const offset = (page - 1) * limit;
  const order = sort === 'rating_desc' ? [['course_rating', 'DESC']] : [['course_rating', 'ASC']];

  const where = {};
  if (category) where.course_category = category;

  const courses = await Course.findAll({ where, order, limit, offset });
  return courses;
};

const createCourse = async (data) => {
  return await Course.create(data);
};

module.exports = { getAllCourses, createCourse };
