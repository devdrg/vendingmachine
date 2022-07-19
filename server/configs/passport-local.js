const User = require("../models/user");
const PassportLocal = require("passport-local");
const jwt = require('jsonwebtoken');

module.exports = (passport) => {
    passport.use(new PassportLocal(
        function (username, password, done) {
        // const foundUser = await User.find({ email: new RegExp(`^${email}$`, 'i'), isDeleted: false })

            User.findOne({ email: new RegExp(`^${username}$`, 'i'), isDeleted: false }, async function (err, user) {
                // console.log(user)
            // User.findOne({ email: username, isDeleted: false }, async function (err, user) {
                if (err) {
                    return done(err);
                }
                if (user) {
                    console.log(user);
                    console.log(typeof(user.createdAt));
                    if (await user.isValidPassword(password)) {
                        const returnedToken = jwt.sign( { id: user._id }, process.env.APP_SECRET, { expiresIn: '14d'} );
                        // done(null, { id: user._id, email: user.email, avatarImage: user.avatarImage });
                        user.lastVisit = Date.now();
                        await user.save();
                        done(null, { id: user._id, email: user.email, role: user.role, isVerified: user.isVerified, token: returnedToken });
                    } else {
                        done(null, null);
                    }
                } else {
                    done(null, null);
                }
                return done(null, false, { message: "E-mail sau parolă greșită." });
            });
        }
    ));

    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser((id, done) => {
        User.findOne({ _id: id }, (err, user) => {
            if (err) {
                done(err);
            }
            if (user) {
                done(null, {
                    id: user._id,
                    username: user.username,
                    password: user.password
                });
            } else {
                done({
                    msg: "bad ID"
                });
            }
        });
    });
};
