const User = require('../models/userModal')
const asyncHandler = require("express-async-handler");
const bcrypt = require('bcrypt');
const { check, validationResult } = require("express-validator");
const {
    generateAccessToken,
    generateRefreshToken,
} = require('../utils/jwtUtils');

/**
 * @function registerUser
 * @desc register user
 * @route POST /api/user
 * @access public
 */
exports.registerUser = [
    check("username")
        .notEmpty()
        .withMessage("username is required")
        .isLength({ min: 3 })
        .withMessage("username must be at least 3 characters long"),
    check("email").isEmail().withMessage("Please provide a valid email address"),
    check("first_name")
        .notEmpty()
        .withMessage("firstName is required")
        .isLength({ min: 3 })
        .withMessage("firstName must be at least 3 characters long"),
    check("last_name")
        .notEmpty()
        .withMessage("last_name is required")
        .isLength({ min: 3 })
        .withMessage("last_name must be at least 3 characters long"),
    check("bio")
        .optional(),
    check("role").notEmpty().withMessage("Please provide a role of user"),
    check('password')
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters long')
        .matches(/\d/) // Ensure it contains at least one digit
        .withMessage('Password must contain at least one number')
        .matches(/[A-Z]/) // Ensure it contains at least one uppercase letter
        .withMessage('Password must contain at least one uppercase letter')
        .matches(/[a-z]/) // Ensure it contains at least one lowercase letter
        .withMessage('Password must contain at least one lowercase letter')
        .matches(/[\W_]/) // Ensure it contains at least one special character
        .withMessage('Password must contain at least one special character'),
    asyncHandler(async (req, res) => {

        const errors = validationResult(req);

        // If there are validation errors
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        // Extract validated data
        const { username, email, first_name, last_name, bio, role, password } = req.body;

        const userAvailable = await User.findOne({ email });
        if (userAvailable) {
            res.status(400);
            throw new Error("User already registered!");
        }

        //save user
        const user = await User.create({ username, email, first_name, last_name, bio, role, password });

        if (user) {
            const userObj = user.toObject();
            delete userObj.password
            //return user info without passwords
            res.status(201).json({
                message: 'Registration successful!',
                userObj
            });
        } else {
            res.status(400);
            throw new Error("user data is not valid!");
        }

    })
]


/**
 * @function login
 * @desc login user
 * @route GET /api/user/login
 * @access public
 */
exports.login = [
    check("email").isEmail().withMessage("Please provide a valid email address"),
    check('password')
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters long')
        .matches(/\d/) // Ensure it contains at least one digit
        .withMessage('Password must contain at least one number')
        .matches(/[A-Z]/) // Ensure it contains at least one uppercase letter
        .withMessage('Password must contain at least one uppercase letter')
        .matches(/[a-z]/) // Ensure it contains at least one lowercase letter
        .withMessage('Password must contain at least one lowercase letter')
        .matches(/[\W_]/) // Ensure it contains at least one special character
        .withMessage('Password must contain at least one special character'),
    asyncHandler(async (req, res) => {
        const errors = validationResult(req);

        // If there are validation errors
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email, password } = req.body;
        const user = await User.findOne({ email });


        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password!'
            });
        }

        const userObj = user.toObject();
        delete userObj.password



        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        res.json({
            message: 'Login successful!',
            userObj,
            accessToken,
            refreshToken,
        })
    })

]