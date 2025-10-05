const pool = require('../utils/db');
const bcrypt = require('bcryptjs');

const User = {
  create: async (user) => {
    const hashedPassword = await bcrypt.hash(user.password, 10);
    const { name, email, role, age, guardian_info, specialization } = user;
    const res = await pool.query(
      'INSERT INTO a_user (user_name, user_email, user_password, user_role, age, guardian_info, specialization) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING user_id, user_name, user_email, user_role',
      [name, email, hashedPassword, role, age, guardian_info, specialization]
    );
    return res.rows[0];
  },

  update: async (id, user) => {
    const { name, email, role, age, guardian_info, specialization } = user;
    const res = await pool.query(
        'UPDATE a_user SET user_name=$1, user_email=$2, user_role=$3, age=$4, guardian_info=$5, specialization=$6 WHERE user_id=$7 RETURNING user_id, user_name, user_email, user_role',
        [name, email, role, age, guardian_info, specialization, id]
    );
    return res.rows[0];
  },

  delete: async (id) => {
    await pool.query('DELETE FROM a_user WHERE user_id=$1', [id]);
    return { message: 'User deleted' };
  },

  getByEmail: async (email) => {
    const res = await pool.query('SELECT * FROM a_user WHERE user_email=$1', [email]);
    return res.rows[0];
  },

  getById: async (id) => {
    const res = await pool.query('SELECT user_id, user_name, user_email, user_role, age, guardian_info, specialization FROM a_user WHERE user_id=$1', [id]);
    return res.rows[0];
  },

  findByRole: async (role) => {
    const res = await pool.query('SELECT user_id, user_name, user_email, user_role, age, guardian_info, specialization FROM a_user WHERE user_role=$1 ORDER BY user_name ASC', [role]);
    return res.rows;
  },
  
  updateRefreshToken: async (id, token) => {
      await pool.query('UPDATE a_user SET refresh_token=$1 WHERE user_id=$2', [token, id]);
  }
};

module.exports = User;