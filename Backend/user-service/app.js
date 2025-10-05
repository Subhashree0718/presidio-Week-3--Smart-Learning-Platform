// app.js (User Service root)
const express = require('express');
const app = express();
require('dotenv').config();
const cors = require('cors');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const logger = require('./middleware/logger');
const userRoutes = require('./routes/userRoutes');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger/swagger.json');

app.use(cors({
  origin: 'https://presidio-week-3-smart-learning-plat.vercel.app', // frontend origin
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());
app.use(logger);

app.use(session({
  secret: process.env.SESSION_SECRET || 'dev-secret',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 60 * 60 * 1000 } 
}));

app.use('/users', userRoutes);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`User Service running on port ${PORT}`));
