// db.js
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: 'postgresql://smart_learn_user:T2CX4yxF1Bq7BkvV8WZ4N38tqSK0cJ1l@dpg-d3hb9j1r0fns73c8vgbg-a/smart_learn',
  ssl: { rejectUnauthorized: false }, 
});

module.exports = pool;
