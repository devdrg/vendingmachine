"use strict";

const express = require("express");
const router = express.Router();
const passport = require("passport");
// const authCheck = require("../../middleware/auth-check");
// const adminCheck = require("../../middleware/admin-check");

const { isLoggedIn } = require("../../middleware/user");
const {
    registerUser,
    loginJWT,
} = require("../../services/http/user");

require("../../configs/passport-jwt")(passport);
require("../../configs/passport-local")(passport);



// INVITATION ROUTES
// router.get("/invited", adminCheck, invitationList);
// router.post("/invited", adminCheck, inviteUser);
// router.delete("/invited", adminCheck, withdrawInvitation);

// USER ROUTES
// router.get("/users", adminCheck, userList);
// router.get("/users/:id", adminCheck, userDetails);
// router.put("/users", adminCheck, userList);
// router.delete("/users", adminCheck, userList);

// router.put("/users/activate", adminCheck, activateUser);
// router.put("/users/suspend", adminCheck, suspendUser);
// router.put("/users/unsuspend", adminCheck, unSuspendUser);
// router.put("/users/delete", adminCheck, deleteUser);


// AUTH ROUTES
// router.use("/resetPassword", sendPasswordReset)resetPassword
// router.post('/forgotPassword', sendPasswordReset);       // 
// router.post('/resetPassword/:token', resetPassword); 
// router.post('/resetPassword', resetPassword); 

// router.route("/changePassword").post(protect, resetPassword)

//
// router.post('/sendEmail', adminCheck, sendEmail); 

// router.route("/changePassword").post(protect, changePassword)

router.post("/register", registerUser);


router.route("/logout")
    .get(isLoggedIn, (req, res) => {
        req.session.destroy(() => {
            res.json({ message: "Successfully logged out" });
        });
    });

router.route("/login")
    .post(passport.authenticate("local"), (req, res) => {
        const { user } = req;
        return res.status(200).json({
            success: true,
            user
        });
    });

router.route("/isAuthenticated")
    .get(isLoggedIn, (req, res) => {
        console.log("testestestestest")
        res.status(200).json(req.user);
    });

router.route("/login/jwt")
    .post(loginJWT);

// router.route("/login")
//     .post(passport.authenticate("local"), (req, res) => {
//         const { user } = req;
//         return res.status(200).json({
//             success: true,
//             user
//         });
//     });

module.exports = router;
