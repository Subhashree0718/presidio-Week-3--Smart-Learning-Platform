const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  try {
    const foundUser = await User.getByEmail(email);
    if (!foundUser) return res.status(401).json({ message: 'Unauthorized' });

    const match = await bcrypt.compare(password, foundUser.user_password);
    if (!match) return res.status(401).json({ message: 'Unauthorized' });

    const userInfo = { id: foundUser.user_id, name: foundUser.user_name, role: foundUser.user_role };

    const accessToken = jwt.sign(userInfo, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
    const refreshToken = jwt.sign({ id: foundUser.user_id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });

    await User.updateRefreshToken(foundUser.user_id, refreshToken);

    res.cookie('jwt', refreshToken, {
      httpOnly: true, // Accessible only by web server
      secure: true, // https
      sameSite: 'None', // cross-site cookie
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    res.json({ accessToken, user: userInfo });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const refresh = async (req, res) => {
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.status(401).json({ message: 'Unauthorized' });

    const refreshToken = cookies.jwt;

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, async (err, decoded) => {
        if (err) return res.status(403).json({ message: 'Forbidden' });

        const foundUser = await User.getById(decoded.id);
        if (!foundUser) return res.status(401).json({ message: 'Unauthorized' });

        const userInfo = { id: foundUser.user_id, name: foundUser.user_name, role: foundUser.user_role };
        const accessToken = jwt.sign(userInfo, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
        
        res.json({ accessToken, user: userInfo });
    });
};

const logout = async (req, res) => {
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(204); // No content

    // You should also clear the refresh token in the database
    // For simplicity here, we just clear the cookie
    res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
    res.json({ message: 'Cookie cleared' });
};


module.exports = { login, refresh, logout };