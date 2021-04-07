const Category = require("../models/category");
const {check, validationResult} = require("express-validator");

exports.getCategoryById = (req, res, next, id) => {
    Category.findById(id).exec((err, category) => {
        if (err || !category) {
            return res.status(400).json({
                success: false,
                message: "Category Not Found."
            });
        }
        req.category = category;
        next();
    });
};

exports.getCategory = (req, res) => {
    return res.json(req.category);
};

exports.getAllCategories = (req, res) => {
    Category.find().exec((err, categories) => {
        if (err || !categories) {
            return res.status(400).json({
                success: false,
                error: "Categories Not Found."
            });
        }

        return res.json({
            success: true,
            message: "Categories Retrieved Successfully.",
            categories
        });
    });
};

exports.createCategory = (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).json({
            error: {
                success: false,
                message: errors.array()[0].msg,
                param: errors.array()[0].param
            }
        });
    }

    const category = new Category(req.body);
    category.save((err, category) => {
        if (err || !category) {
            return res.status(400).json({
                success: false,
                error: "Failed To Save Category.\nPlease Try Again.",
            });
        }

        return res.json({
            success: true,
            message: "Category Created Successfully.",
            category
        });
    });
};

exports.updateCategory = (req, res) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).json({
            error: {
                success: false,
                message: errors.array()[0].msg,
                param: errors.array()[0].param
            }
        });
    }

    const category = req.category;
    category.name = req.body.name;

    category.save((err, category) => {
        if (err || !category) {
            return res.status(400).json({
                success: false,
                error: "Failed To Update Category.\nPlease Try Again.",
            });
        }

        return res.json({
            success: true,
            message: "Category Updated Successfully.",
            category
        });
    });

    /*Category.findByIdAndUpdate(
        {_id: req.category._id},
        {$set: req.body},
        {new: true, findAndModify: false},
        (err, category) => {
            if (err || !category) {
                return res.status(400).json({
                    success: false,
                    error: "Failed To Update Category.\nPlease Try Again.",
                });
            }

            return res.json({
                success: true,
                message: "Category Updated Successfully.",
                category
            });
        }
    );*/
};

exports.removeCategory = (req, res) => {
    const category = req.category;

    category.remove((err, category) => {
        if (err || !category) {
            return res.status(400).json({
                success: false,
                error: "Failed To Delete Category.\nPlease Try Again.",
            });
        }

        return res.json({
            success: true,
            message: category.name + " Category Deleted Successfully."
        });
    });
};