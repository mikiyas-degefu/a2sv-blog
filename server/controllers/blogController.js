const User = require('../models/userModel')
const Blog = require('../models/blogModel')
const asyncHandler = require("express-async-handler");
const { check, validationResult } = require("express-validator");



/**
 * @function addBlog
 * @desc add blog
 * @route POST /api/blog
 * @access private
 */

exports.addBlog = [
    check('title')
        .notEmpty()
        .withMessage("title is required")
        .isLength({ min: 3 })
        .withMessage("title must be at least 3 characters long"),
    check('content')
        .notEmpty()
        .withMessage("content is required")
        .isLength({ min: 10 })
        .withMessage("content must be at least 10 characters long"),
    asyncHandler(async (req, res) => {
        const errors = validationResult(req);

        // If there are validation errors
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const user_id = req.user._id //login user
        // Extract validated data
        const { title, content } = req.body;

        //save blog
        const blog = await Blog.create({
            user_id,
            title,
            content
        })

        if (blog) {
            res.status(201).json({ message: 'Blog created successfully!', blog });
        }

    })

]

/**
 * @function getAllBlogs
 * @desc get all blogs
 * @route Get /api/blog
 * @access private
 */
exports.getAllBlogs = asyncHandler(async (req, res) => {
    const blogs = await Blog.find().populate(
        'user_id',
        'username'
    );
    res.status(200).json(blogs);
})

