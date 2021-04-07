const express = require('express');
const router = express.Router();
const {check, validationResult} = require("express-validator");

const {getUserById} = require("../controllers/user");
const {isSignedIn, isAuthenticated, isAdmin} = require("../controllers/auth");

const {getCategoryById, getCategory, getAllCategories} = require("../controllers/category");
const {createCategory, updateCategory, removeCategory} = require("../controllers/category");

router.param("userId", getUserById);
router.param("categoryId", getCategoryById);

router.post("/category/create/:userId", [
        check('name')
            .isLength({min: 3})
            .withMessage('category name must be at least 3 chars long')
    ],
    isSignedIn,
    isAuthenticated,
    isAdmin,
    createCategory);

router.get("/category/:categoryId", getCategory);
router.put("/category/:categoryId/:userId", [
        check('name')
            .isLength({min: 3})
            .withMessage('category name must be at least 3 chars long')
    ],
    isSignedIn,
    isAuthenticated,
    isAdmin,
    updateCategory);
router.delete("/category/:categoryId/:userId", isSignedIn, isAuthenticated, isAdmin, removeCategory);

router.get("/categories", getAllCategories);

module.exports = router;