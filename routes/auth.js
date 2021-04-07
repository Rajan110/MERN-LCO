const express = require("express");
const router = express.Router();
const {check, validationResult} = require("express-validator");
const {signup, signin, signout, isSignedIn} = require("../controllers/auth");


router.post("/signup", [
        check('name')
            .isLength({min: 3})
            .withMessage('name must be at least 3 chars long'),
        check('email')
            .isEmail()
            .withMessage('E-Mail must be Valid.'),
        check('password')
            .isLength({min: 5})
            .withMessage('password must be at least 5 chars long')
            .matches(/\d/)
            .withMessage('must contain a number')
    ],
    signup);

router.post("/signin",
    [
        check('email')
            .isEmail()
            .withMessage('E-Mail must be Valid.'),
        check('password')
            .isLength({min: 5})
            .withMessage('password is Required.')
    ],
    signin);

router.get("/signout", signout);

/*router.get("/testRoute", isSignedIn, (req, res) => {
        res.json(req.auth);
    }
);*/

module.exports = router;