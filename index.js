// dotenv is a zero-dependency module that loads environment variables from a .env file into process.env
require('dotenv').config();

// Import necessary modules
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

require('./config/passportConfig');


// Create Express app
const app = express();

// Middleware for parsing JSON data
app.use(bodyParser.json());

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI);
const db = mongoose.connection;

// Import routes
const tradeRoutes = require('./routes/tradeRoutes');
const portfolioRoutes = require('./routes/portfolioRoutes');
const authRoutes = require('./routes/authRoutes');

// Import middleware
const authenticateToken = require('./middlewares/authMiddleware');

// Use authentication middleware for all routes except auth routes
app.use('/auth', authRoutes);
app.use(authenticateToken);

// Use routes
app.use('/trades', tradeRoutes);
app.use('/portfolio', portfolioRoutes);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
