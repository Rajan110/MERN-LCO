const User = require("../models/user");
const {Order} = require("../models/order")

exports.getUserById = (req, res, next, id) => {
    User.findById(id).exec((err, user) => {
        if (err || !user) {
            return res.status(400).json({
                success: false,
                message: "User Not Found."
            });
        }
        req.profile = user;
        next();
    });
};

exports.getUser = (req, res) => {

    req.profile.salt = undefined;
    req.profile.encry_password = undefined;
    req.profile.createdAt = undefined;
    req.profile.updatedAt = undefined;

    return res.json(req.profile);
};

exports.updateUser = (req, res) => {
    User.findByIdAndUpdate(
        {_id: req.profile._id},
        {$set: req.body},
        {new: true, findAndModify: false},
        (err, user) => {
            if (err || !user) {
                return res.status(401).json({
                    success: false,
                    message: "You're Un-Authorized User For This Operation"
                });
            }

            user.salt = undefined;
            user.encry_password = undefined;

            return res.json({
                success: true,
                message: "User Details Updated Updated Successfully.",
                user
            });
        }
    );
};

exports.userPurchaseList = (req, res) => {
    Order.find({user: req.profile._id})
        .populate()
        .exec((err, order) => {
            if (err) {
                return res.status(400).json({
                    success: false,
                    message: "User Orders Not Found."
                });
            }

            return res.json({
                success: true,
                message: "User Orders Retrieved Successfully.",
                order
            })
        });
};

exports.pushOrderInPurchaseList = (req, res, next) => {
    let purchases = [];
    req.body.order.products.forEach(product => {
        purchases.push({
            _id: product._id,
            name: product.name,
            description: product.description,
            category: product.category,
            quantity: product.quantity,
            amount: req.body.order.amount,
            transaction_id: req.body.order.transaction_id
        });
    });

    User.findOneAndUpdate(
        {_id: req.profile._id},
        {$push: {purchases: purchases}},
        {new: true},
        (err, purchases) => {
            if (err) {
                return res.status(400).json({
                    success: false,
                    error: "Unable To Save Purchase List."
                })
            }
            next();
        }
    );
};

exports.getAllUsers = (req, res) => {
    User.find().exec((err, users) => {
        if (err || !users) {
            return res.status(400).json({
                success: false,
                message: "Users Not Found."
            });
        }
        return res.json({
            success: true,
            users
        });
    });
};