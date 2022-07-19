
const User = require("../models/user");
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.APP_SECRET;

module.exports = (passport) => {
    passport.use(new JwtStrategy(opts, function (jwtPayload, done) {
        console.log("yeste");
        User.findById(jwtPayload.id, function (err, user) {
            if (err) {
                return done(err, false);
            }
            if (user) {
                return done(null, { id: user._id, username: user.username });
            } else {
                return done(null, false);
            }
        });
    }));
};
