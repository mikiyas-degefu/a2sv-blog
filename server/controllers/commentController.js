const Blog = require('../models/blogModel')
const Comment = require('../models/commentModel')
const asyncHandler = require("express-async-handler");
const { check, validationResult } = require("express-validator");


/**
 * @function addRating
 * @desc add blog rate
 * @route POST /api/blog-rate
 * @access private
 */


exports.addComment = [
    check('blog_id')
        .notEmpty()
        .withMessage("title is required")
        .isLength({ min: 3 })
        .withMessage("title must be at least 3 characters long"),
    check('content')
        .notEmpty()
        .withMessage("content is required")
        .isLength({ min: 1 })
        .withMessage("content must be at least 1 characters long"),
    asyncHandler(async (req, res) => {
        const errors = validationResult(req);

        // If there are validation errors
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        // Extract validated data
        const { blog_id, content } = req.body;

        const blog = await Blog.findOne({ _id: blog_id });

        if (!blog) {
            res.status(404);
            throw new Error('Blog not found!');
        }

        //check user rate the blog
        const checkCommentAvailability = await Comment.findOne({
            blog_id: blog_id,
            user_id: req.user._id
        })

        if (checkCommentAvailability) {
            const updatedCommentAvailability = await Comment.findByIdAndUpdate(
                checkCommentAvailability.id,
                { content: content },
                { new: true }
            )
            if (updatedCommentAvailability) {
                res.status(201).json({ message: 'Blog successfully commented!', updatedCommentAvailability });
                return
            }

        }

        const comment = await Comment.create({
            user_id: req.user._id,
            blog_id: blog_id,
            content: content
        })

        if (comment) {
            res.status(201).json({ message: 'Blog successfully commented!', comment });
        }

    })
]