const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser'); // Add this
require('dotenv').config();

const userRoutes = require('./routes/user');

const app = express();
const port = process.env.PORT || 5000;

// Middleware - Add cookieParser before CORS
app.use(cookieParser());
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie']
}));
app.use(express.json());

// MongoDB connection
const uri = process.env.MONGO_URI;

mongoose.connect(uri, {
  dbName: "coursemasteDB"
})
.then(() => {
  console.log("MongoDB connected successfully");
})
.catch((err) => {
  console.error("MongoDB connection error:", err.message);
});

// JWT Middleware
const authenticateToken = (req, res, next) => {
  const token = req.cookies.token;
  
  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }
  
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// Routes
app.use('/api/users', userRoutes);

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});