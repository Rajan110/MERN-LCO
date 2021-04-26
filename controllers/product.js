const formidable = require("formidable");
const _ = require("lodash");
const fs = require("fs");

const Product = require("../models/product");

exports.getProductById = (req, res, next, id) => {
    Product.findById(id)
        .populate("category")
        .exec((err, product) => {
            if (err || !product) {
                return res.status(400).json({
                    success: false,
                    error: "Product Not Found."
                });
            }

            req.product = product;
            next();
        });
};

exports.getProduct = (req, res) => {
    req.product.photo = undefined;
    return res.json({
        success: true,
        message: "Product Retrieved Successfully.",
        product: req.product
    });
};

exports.getAllProducts = (req, res) => {
    let limit = req.query.limit ? parseInt(req.query.limit) : 8;
    let sortBy = req.query.sortBy ? req.query.sortBy : "_id";
    let sortOrder = req.query.sortOrder ? req.query.sortOrder : "asc";


    Product.find()
        .select('-photo')
        .populate('category')
        .sort([[sortBy, sortOrder]])
        .limit(limit)
        .exec((err, products) => {
            if (err || !products) {
                return res.status(400).json({
                    success: false,
                    error: "Products Not Found."
                });
            }
            return res.json({
                success: true,
                message: "Products Retrieved Successfully.",
                products: products
            });
        });
};

exports.createProduct = (req, res) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;

    form.parse(req, (err, fields, file) => {
        if (err) {
            return res.status(400).json({
                success: false,
                error: "Image Invalid."
            });
        }

        /*const errors = validationResult(fields.all);

        if (!errors.isEmpty()) {
            return res.status(422).json({
                success: false,
                error: errors
            });
        }*/

        const {name, description, price, category, stock} = fields;

        if (!name || !description || !price || !category || !stock) {
            return res.status(422).json({
                success: false,
                error: "All Fields Are Required."
            });
        }

        let product = new Product(fields);

        if (file.photo) {
            let size_in_MB = 2; // 1024 *1024 * size_in_MB gives size in bytes
            if (file.photo.size > 1024 * 1024 * size_in_MB) {
                return res.status(400).json({
                    success: false,
                    error: "Image Size Too Large. Max: 2 MB"
                });
            }

            product.photo.data = fs.readFileSync(file.photo.path);
            product.photo.contentType = file.photo.type;
        }

        product.save((err, product) => {
            if (err || !product) {
                return res.status(400).json({
                    success: false,
                    error: "Failed To Save Product."
                });
            }
            product.photo = undefined;
            return res.json({
                success: true,
                message: "Product Added Successfully.",
                product
            });
        })
    });
};

exports.updateProduct = (req, res) => {

    let form = new formidable.IncomingForm();
    form.keepExtensions = true;

    form.parse(req, (err, fields, file) => {
        if (err) {
            return res.status(400).json({
                success: false,
                error: "Image Invalid."
            });
        }

        let product = req.product;
        product = _.extend(product, fields);

        if (file.photo) {
            let size_in_MB = 2; // 1024 *1024 * size_in_MB gives size in bytes
            if (file.photo.size > 1024 * 1024 * size_in_MB) {
                return res.status(400).json({
                    success: false,
                    error: "Image Size Too Large. Max: 2 MB"
                });
            }

            product.photo.data = fs.readFileSync(file.photo.path);
            product.photo.contentType = file.photo.type;
        }

        product.save((err, product) => {
            if (err || !product) {
                return res.status(400).json({
                    success: false,
                    error: "Failed To Update Product."
                });
            }

            return res.json({
                success: true,
                message: "Product Updated Successfully.",
                product
            });
        })
    });
};

exports.removeProduct = (req, res) => {
    const product = req.product;

    product.remove((err, product) => {
        if (err || !product) {
            return res.status(400).json({
                success: false,
                error: "Failed To Delete Product."
            });
        }

        return res.json({
            success: true,
            message: "Product Deleted Successfully."
        });
    })
};

//middleware
exports.photo = (req, res, next) => {
    if (req.product.photo.data) {
        res.set("Content-Type", req.product.photo.contentType);
        return res.send(req.product.photo.data);
    }
    next();
};

exports.getAllUniqueCategories = (req, res) => {
    Product.distinct("category", {}, (err, categories) => {
        if (err || !categories) {
            return res.status(400).json({
                success: false,
                error: "Product Categories Not Found."
            });
        }

        return res.json({
            success: true,
            message: "Product Categories Retrieved Successfully.",
            categories
        });
    });
};

exports.updateStock = (req, res, next) => {
    let myOpertaions = req.body.order.product.map(prod => {
        return {
            updateOne: {
                filter: {_id: prod._id},
                update: {
                    $inc: {
                        stock: -prod.count,
                        sold: +prod.count
                    }
                }
            }
        }
    });

    Product.bulkWrite(myOpertaions, {}, (err, products) => {
        if (err || !products) {
            return res.status(400).json({
                success: false,
                error: "Bulk Operation Failed."
            });
        }
        next();
    });
};