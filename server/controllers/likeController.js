const Blog = require('../models/blogModel')
const Like = require('../models/likeModel')
const asyncHandler = require("express-async-handler");
const { check, validationResult } = require("express-validator");


/**
 * @function addLike
 * @desc add blog like
 * @route POST /api/like
 * @access private
 */


exports.addLike = [
    check('blog_id')
        .notEmpty()
        .withMessage("title is required")
        .isLength({ min: 3 })
        .withMessage("title must be at least 3 characters long"),
    asyncHandler(async (req, res) => {
        const errors = validationResult(req);

        // If there are validation errors
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        // Extract validated data
        const { blog_id } = req.body;

        const blog = await Blog.findOne({ _id: blog_id });

        if (!blog) {
            res.status(404);
            throw new Error('Blog not found!');
        }

        //check user like the blog
        const checkLikeAvailability = await Like.findOne({
            blog_id: blog_id,
            user_id: req.user._id
        })

        if (checkLikeAvailability) {
            const updatedLikeAvailability = await Like.findByIdAndUpdate(
                checkLikeAvailability.id,
                { new: true }
            )
            if (updatedLikeAvailability) {
                res.status(201).json({ message: 'Blog successfully liked!', updatedLikeAvailability });
                return
            }

        }

        const like = await Like.create({
            user_id: req.user._id,
            blog_id: blog_id,
        })

        if (like) {
            res.status(201).json({ message: 'Blog successfully liked!', like });
        }

    })
]