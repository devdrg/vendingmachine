const jwt = require('jsonwebtoken');
// const config = require('../config/config');
const User = require('../models/user');

jwt_secret = process.env.APP_SECRET;
authCheck = (req, res, next) => {
    let token = req.headers.authorization;
    if (token) {
        jwt.verify(token, jwt_secret, (err, decoded) => {
            if (err)  {
                console.log(err);
                res.status(401).json({
                    message: 'Failed to authenticate token'
                });
            } else if (decoded) {
                User.findOne({_id: decoded.id}).exec().then(async (user) => {
                    res.locals.user = user;
                    next();
                }).catch((err) => {
                    console.log(err)
                    res.status(500).json({
                        message: err
                    });
                });
            } else {
                console.log("token expired")
                res.status(401).json({
                    message: 'Token expired.'
                });
            }
        });
    } else {
        res.status(401).json({
            message: 'No token provided'
        });
    }
};


module.exports = authCheck;