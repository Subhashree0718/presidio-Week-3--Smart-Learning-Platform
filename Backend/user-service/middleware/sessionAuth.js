const sessionAuth = (req, res, next) => {
  if (!req.session.user) return res.status(401).json({ message: 'Unauthorized' });
  req.user = req.session.user;
  next();
};
module.exports = sessionAuth;
