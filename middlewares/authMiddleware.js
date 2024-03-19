// authMiddleware.js
const passport = require('passport');

// Middleware to authenticate bearer token
const authenticateToken = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user, info) => {
    if (err || !user) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }
    req.user = user;
    next();
  })(req, res, next);
};

module.exports = authenticateToken;
