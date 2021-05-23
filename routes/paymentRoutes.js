const express = require("express");
const router = express.Router();

const { isSignedIn, isAuthenticated } = require("../controllers/auth");

const {
  payViaStripe,
  payViaPaypal,
  getPaypalToken,
} = require("../controllers/payment");
const { getUserById } = require("../controllers/user");

router.param("userId", getUserById);

router.post(
  "/stripePayment/:userId",
  isSignedIn,
  isAuthenticated,
  payViaStripe
);

router.get(
  "/payPalPayment/getToken/:userId",
  isSignedIn,
  isAuthenticated,
  getPaypalToken
);

router.post(
  "/payPalPayment/:userId",
  isSignedIn,
  isAuthenticated,
  payViaPaypal
);

module.exports = router;
