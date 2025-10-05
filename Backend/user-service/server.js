const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();
const userRoutes = require('./routes/userRoutes');

const app = express();

// Middleware
app.use(cors({
    origin: 'https://presidio-week-3-smart-learning-plat.vercel.app', // Your frontend URL
    credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/api/users', userRoutes);

// Start Server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`User Service running on port ${PORT}`));
