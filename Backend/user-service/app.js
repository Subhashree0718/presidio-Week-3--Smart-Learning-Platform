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

const allowedOrigins = [
  'https://presidio-week-3-smart-learning-plat.vercel.app',
  'http://localhost:5173'
];

app.use(cors({
  origin: function(origin, callback){
    // allow requests with no origin (like Postman)
    if(!origin) return callback(null, true);
    if(allowedOrigins.indexOf(origin) === -1){
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
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
