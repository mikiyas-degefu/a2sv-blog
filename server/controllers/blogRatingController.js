const User = require('../models/userModel')
const Blog = require('../models/blogModel')
const BlogRating = require('../models/blogRatingModel')
const asyncHandler = require("express-async-handler");
const { check, validationResult } = require("express-validator");


/**
 * @function addRating
 * @desc add blog rate
 * @route POST /api/blog-rate
 * @access private
 */


exports.addRating = [
    check('blog_id')
        .notEmpty()
        .withMessage("title is required")
        .isLength({ min: 3 })
        .withMessage("title must be at least 3 characters long"),
    check('rating')
        .notEmpty()
        .withMessage("rating is required")
        .isNumeric({ min: 5, max: 5 })
        .withMessage("rating should be between 1-5"),
    asyncHandler(async (req, res) => {
        const errors = validationResult(req);

        // If there are validation errors
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        // Extract validated data
        const { blog_id, rating } = req.body;

        const blog = await Blog.findOne({ _id: blog_id });

        if (!blog) {
            res.status(404);
            throw new Error('Blog not found!');
        }

        //check user rate the blog
        const checkBlogRatingAvailability = await BlogRating.findOne({
            blog_id: blog_id,
            user_id: req.user._id
        })

        if (checkBlogRatingAvailability) {
            const updatedBlogRatingAvailability = await BlogRating.findByIdAndUpdate(
                checkBlogRatingAvailability.id,
                { rating: rating },
                { new: true }
            )
            if (updatedBlogRatingAvailability) {
                res.status(201).json({ message: 'Blog successfully rated!', blog });
                return
            }

        }

        const blogRating = await BlogRating.create({
            user_id: req.user._id,
            blog_id: blog_id,
            rating: rating
        })

        if (blogRating) {
            res.status(201).json({ message: 'Blog successfully rated!', blog });
        }

    })
]