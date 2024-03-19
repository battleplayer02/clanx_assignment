// controllers/authController.js
const jwt = require('jsonwebtoken');
const passport = require('passport');
const User = require('../models/user');

// Controller function to register a new user
exports.register = async (req, res) => {
    try {
        const { username, password } = req.body;

        // Check if username already exists
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ success: false, message: 'Username already exists' });
        }

        // Validate password strength
        const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}$/;
        if (!passwordRegex.test(password)) {
            return res.status(400).json({ success: false, message: 'Password must contain at least 6 characters including at least one uppercase letter, one lowercase letter, and one number' });
        }

        // Create new user
        const user = new User({ username, password });
        await user.save();
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

        res.json({ success: true, message: 'User registered successfully', token});
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// Controller function to authenticate user and issue JWT token
exports.login = (req, res, next) => {
    passport.authenticate('local', { session: false }, (err, user, info) => {
        if (err || !user) {
            return res.status(400).json({
                success: false,
                message: 'Invalid username or password'
            });
        }
        req.login(user, { session: false }, async (err) => {
            if (err) {
                res.send(err);
            }
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
            return res.json({ success: true, token });
        });
    })(req, res, next);
};
