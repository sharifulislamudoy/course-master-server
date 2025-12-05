const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const userRoutes = require('./routes/user');
const courseRoutes = require('./routes/course'); // Add this line

const app = express();
const port = process.env.PORT || 5000;

// Middleware
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

// Routes
app.use('/api/users', userRoutes);
app.use('/api/courses', courseRoutes); // Add this line

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});