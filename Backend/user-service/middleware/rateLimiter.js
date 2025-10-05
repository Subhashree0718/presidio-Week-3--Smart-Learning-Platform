const rateLimit = require('express-rate-limit');
const authLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
  message: 'Too many login/signup attempts, try again later.'
});
module.exports = authLimiter;
