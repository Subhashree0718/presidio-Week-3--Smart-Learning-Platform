const fs = require('fs');
const path = require('path');
const logFile = path.join(__dirname, '../logs/app.log');
const logger = (req, res, next) => {
  const log = `${new Date().toISOString()} | ${req.method} ${req.path}\n`;
  fs.appendFileSync(logFile, log);
  console.log(log.trim());
  next();
};
module.exports = logger;
