const express = require("express");
const router = express.Router();
const {check, validationResult} = require("express-validator");

const {isSignedIn, isAuthenticated, isAdmin} = require("../controllers/auth")
const {getUserById} = require("../controllers/user");
const {getCategoryById} = require("../controllers/category");
const {
    getProductById,
    getProduct,
    getAllProducts,
    createProduct,
    updateProduct,
    removeProduct,
    photo,
    getAllUniqueCategories
} = require("../controllers/product");

router.param("userId", getUserById);
router.param("categoryId", getCategoryById);
router.param("productId", getProductById);

router.get("/product/:productId", getProduct);
router.get("/product/photo/:productId", photo);
router.get("/products", getAllProducts);
router.get("/products/categories/", getAllUniqueCategories);

router.post("/product/create/:userId",
    isSignedIn,
    isAuthenticated,
    isAdmin,
    createProduct);

router.put("/product/:productId/:userId",
    isSignedIn,
    isAuthenticated,
    isAdmin,
    updateProduct);

router.delete("/product/:productId/:userId",
    isSignedIn,
    isAuthenticated,
    isAdmin,
    removeProduct);

module.exports = router;