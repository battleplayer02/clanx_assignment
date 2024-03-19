// passportConfig.js
const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const User = require('../models/user');

const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET
};

passport.use(new JwtStrategy(jwtOptions, async (payload, done) => {
    try {
        const user = await User.findById(payload.id);
        if (!user) {
            return done(null, false);
        }
        return done(null, user);
    } catch (err) {
        return done(err, false);
    }
}));

module.exports = passport;
