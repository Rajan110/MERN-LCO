const User = require("../models/user");
const {check, validationResult} = require("express-validator");
var jwt = require("jsonwebtoken");
var expressJwt = require("express-jwt");

exports.signin = (req, res) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).json({
            success: false,
            error: {
                error: errors.array()
            }
        });
    }

    const {email, password} = req.body;

    User.findOne({email}, (err, user) => {
        if (err || !user) {
            return res.status(400).json({
                success: false,
                "message": "User Not Found."
            });
        }

        if (!user.authenticate(password)) {
            return res.status(401).json({
                success: false,
                "message": "Invalid Credentials."
            });
        }

        const token = jwt.sign({_id: user._id}, process.env.SECRET);

        res.cookie("token", token, {expire: new Date() + 365});

        const {_id, name, email, role} = user;
        return res.json({
            "success": true,
            "message": "User Login Succssfully.",
            token,
            user: {_id, name, email, role}
        });
    });
};

exports.signup = (req, res) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).json({
            error: {
                success: false,
                error: errors.array()
                // message: errors.array()[0].msg,
                // param: errors.array()[0].param
            }
        });
    }

    const user = new User(req.body);
    user.save((err, user) => {
        if (err || !user) {
            return res.status(400).json({
                success: false,
                error: "Failed to save User / User Exists."
            });
        }

        res.json({
            "success": true,
            "message": "User Sign-Up Successful.",
            "user_details": {
                "id": user._id,
                "name": user.name,
                "lastname": user.lastname,
                "email": user.email
            }
        });
    });
};

exports.signout = (req, res) => {
    res.clearCookie("token");
    res.json({
        success: true,
        message: "User SignOut Successfully."
    });
};

//Protected Routes

exports.isSignedIn = expressJwt({
    secret: process.env.SECRET,
    userProperty: "auth"
});

//Custom Middlewares

exports.isAuthenticated = (req, res, next) => {
    let checker = req.profile && req.auth && req.profile._id == req.auth._id;
    if (!checker) {
        return res.status(403).json({
            success: false,
            message: "ACCESS DENIED"
        });
    }
    next();
};

exports.isAdmin = (req, res, next) => {
    let checker = req.profile.role === 0;
    if (checker) {
        return res.status(403).json({
            success: false,
            message: "You Don't Have Privileges To Access This Route, Access Denied"
        })
    }
    next();
};