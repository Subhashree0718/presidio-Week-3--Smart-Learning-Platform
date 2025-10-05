const rateLimit = require('express-rate-limit');
const recommendationsLimiter = rateLimit({
  windowMs: 60 * 1000, 
  max: 10,
  message: 'Too many requests, try again later.'
});
module.exports = recommendationsLimiter;
