"use strict";

const express = require("express");
const router = express.Router();

// const { isLoggedIn } = require("../../middleware/user");
const authCheck = require("../../middleware/auth-check");


// const {
//     getLoggedInUserAuctions,
//     getLoggedInUserPurchases,
//     getLoggedInUserLiveAuctions,
//     getLoggedInUserParticipatedAuctions
// } = require("../../services/http/auction");

const {
    // changeAvatarImage,
    getLoggedInUserProfile,
    userDeposit,
    userResetDeposit
} = require("../../services/http/user");

// router.route("/my-auctions")
//     .get(isLoggedIn, getLoggedInUserAuctions);

// router.route("/participations")
//     .get(isLoggedIn, getLoggedInUserParticipatedAuctions);
// router.get("/participations", authCheck, getLoggedInUserParticipatedAuctions);

// router.route("/purchased")
//     .get(authCheck, getLoggedInUserPurchases);
// router.get("/purchased", authCheck, getLoggedInUserPurchases);

router.get("/profile", authCheck, getLoggedInUserProfile);
router.put("/deposit", authCheck, userDeposit);
router.get("/reset", authCheck, userResetDeposit);


// router.route("/live-auctions")
//     .get(isLoggedIn, getLoggedInUserLiveAuctions);

// router.route("/changeAvatar").put(isLoggedIn, changeAvatarImage);

module.exports = router;
