const jwt = require('jsonwebtoken');
// const config = require('../config/config');
const User = require('../models/user');

jwt_secret = process.env.APP_SECRET;
adminCheck = (req, res, next) => {
    console.log("adminchecking")
    let token = req.headers.authorization;
    console.log(token)
    if (token) {
        console.log("0")
        jwt.verify(token, jwt_secret, (err, decoded) => {
            console.log("1")

            if (err)  {
                console.log("2")
                console.log(err)
                res.status(401).json({
                    message: 'Failed to authenticate token'
                });
            } else {
                User.findOne({_id: decoded.id}).exec().then((user) => {
                    if (user.role === "admin") {
                        next();
                    } else {
                        res.status(403).json({
                            message: 'Forbidden'
                        });
                    }
                    // req.user = user;
                    // next();
                }).catch((err) => {
                    console.log(err);
                    // res.status(500).json({
                    //     message: err
                    // });
                    res.status(401).json({
                        message: err
                    });
                });
            }
        });
    } else {
        res.status(401).json({
            message: 'No token provided'
        });
    }
};


module.exports = adminCheck;