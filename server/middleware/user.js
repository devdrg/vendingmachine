const userMiddleware = {};
const User = require("../models/user");
const jwt = require("jsonwebtoken");

jwt_secret = process.env.APP_SECRET;

userMiddleware.isLoggedIn = async function (req, res, next) {
    const token = req.headers.authorization;
    if (token) {
        jwt.verify(token, jwt_secret, (err, decoded) => {
            if (err) {
                res.status(401).json({
                    message: "Failed to authenticate token"
                });
            } else {
                User.findOne({ _id: decoded.id }).exec().then((user) => {
                    req.user = user;
                    // User.findByIdAndUpdate(decoded.id, { "lastVisit" : Date.now() }, { new : true });
                    res.locals.user = user._id.toString();
                    next();
                }).catch((err) => {
                    res.status(500).json({
                        message: err
                    });
                });
            }
        });
    } else {
        res.status(401).json({
            message: "No token provided"
        });
    }
};

module.exports = userMiddleware;
