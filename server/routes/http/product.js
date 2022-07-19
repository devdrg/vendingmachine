"use strict";

const express = require("express");
const router = express.Router();

const authCheck = require("../../middleware/auth-check");
// const adminCheck = require("../../middleware/admin-check");

// const { isLoggedIn } = require("../../middleware/user");
// const {
//     getAuction,
//     canUserBuy,
//     isUserAuthor,
//     dateValidation,
//     validatePrice,
//     checkIfAuctionHasEnded,
//     checkIfAuctionHasStarted,
//     checkIfAuctionHasNotStarted
// } = require("../../middleware/auction");
const {
    getAllProducts,
    getProductDetails,
    createNewProduct,
    editProduct,
    deleteProduct,
    buyProduct
} = require("../../services/http/product");





// router.route("/")
//     .get(getAuctions)
//     .post(isLoggedIn, dateValidation, createNewAuction);

// ../offers/ routes
// router.get("/active", authCheck, getLiveAuctions);

//multer
// router.post("/", adminCheck, uploadd, createNewAuction);
// router.post("/", adminCheck, upload.single("document"), createNewAuction);
// router.get("/photo/:id", authCheck, downloadInfo);

router.get("/", authCheck, getAllProducts);
router.get("/:id", getProductDetails);
router.post("/", authCheck, createNewProduct);
router.put("/:id", authCheck, editProduct);
router.delete("/:id", authCheck, deleteProduct);
router.get("/:id/buy", authCheck, buyProduct);


// router.route("/:id", authCheck)
//     // .get(getAuctionDetails)
//     // .put(isLoggedIn, getAuction, isUserAuthor, checkIfAuctionHasStarted, dateValidation, editAuction)
//     .patch(isLoggedIn, getAuction, checkIfAuctionHasNotStarted, checkIfAuctionHasEnded, validatePrice, placeABid, deleteABid)
//     .delete(isLoggedIn, getAuction, deleteAuction);

// router.get(":id/bidders", adminCheck, getBidderDetails);
// router.get("/:id/pdf", authCheck, getDocument);
// router.route("/:id/buy")
//     .patch(isLoggedIn, getAuction, canUserBuy, buyNow);

module.exports = router;
