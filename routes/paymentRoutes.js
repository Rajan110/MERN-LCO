const express = require("express");
const router = express.Router();

const { isSignedIn, isAuthenticated } = require("../controllers/auth");

const { payViaStripe } = require("../controllers/payment");
const { getUserById } = require("../controllers/user");

//router.param("userId", getUserById);

// router.post(
//   "/stripePayment/:userId",
//   isSignedIn,
//   isAuthenticated,
//   payViaStripe
// );

router.post("/stripePayment", payViaStripe);

module.exports = router;
