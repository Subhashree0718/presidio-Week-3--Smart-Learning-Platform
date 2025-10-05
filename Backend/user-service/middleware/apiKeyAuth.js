const apiKeyAuth = (req, res, next) => {
  const apiKey = req.query.apiKey;
  if (apiKey === 'validKey') return next();
  res.status(403).json({ message: 'Invalid API Key' });
};
module.exports = apiKeyAuth;
