// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Route to register a new user
router.post('/register', authController.register);

// Route to authenticate user and issue JWT token
router.post('/login', authController.login);

module.exports = router;
