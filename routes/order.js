const express = require("express");
const router = express.Router();

const {isSignedIn, isAuthenticated, isAdmin} = require("../controllers/auth");
const {getUserById, pushOrderInPurchaseList} = require("../controllers/user");
const {updateStock} = require("../controllers/product");

const {
    getOrderById,
    getOrder,
    createOrder,
    getAllOrders,
    getOrderStatus,
    updateStatus,
    getUserOrders
} = require("../controllers/order");

router.param("userId", getUserById);
router.param("orderId", getOrderById);

router.get("/order/:orderId/:userId", isSignedIn, isAuthenticated, getOrder);

router.post(
    "/order/create/:userId",
    isSignedIn,
    isAuthenticated,
    pushOrderInPurchaseList,
    updateStock,
    createOrder
);

router.get(
    "/orders/:userId",
    isSignedIn,
    isAuthenticated,
    getUserOrders
);

router.get( 
    "/orders/all/:userId",
    isSignedIn,
    isAuthenticated,
    isAdmin,
    getAllOrders
);

//status of order
router.get(
    "/order/:orderId/status/:userId",
    isSignedIn,
    isAuthenticated,
    getOrderStatus
);

router.put(
    "/order/:orderId/status/:userId",
    isSignedIn,
    isAuthenticated,
    isAdmin,
    updateStatus
);

module.exports = router;