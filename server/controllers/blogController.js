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
    // Blog.virtual("comments", {
    //     ref: "Comment",
    //     foreignField: "blog_id",
    //     localField: "_id"
    // });


    const blogs = await Blog.aggregate([
        {
            $lookup: {
                from: 'comments',
                localField: '_id',
                foreignField: 'blog_id',
                as: 'comments'
            },
        },

        {
            $lookup: {
                from: 'likes',
                localField: '_id',
                foreignField: 'blog_id',
                as: 'likes'
            },
        },
        {
            $lookup: {
                from: 'blogratings',
                localField: '_id',
                foreignField: 'blog_id',
                as: 'blogratings'
            },
        },


    ]).exec()

    res.status(200).json(blogs);
})


/**
 * @function updateBlog
 * @desc update blog
 * @route PUT /api/blog/id
 * @access private
 */
exports.updateBlog = [
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
        const blog = await Blog.findById({
            _id: req.params.id,
            user_id: req.user._id
        })

        if (!blog) {
            res.status(404)
            throw new Error("Blog not found!")
        }

        const errors = validationResult(req);

        // If there are validation errors
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }


        const updatedBlog = await Blog.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true } // return the updated element
        )

        if (updatedBlog) {
            res.status(201).json({ message: 'Blog updated successfully!', blog });
        }



    })

]


/**
 * @function deleteBlog
 * @desc update blog
 * @route DELETE /api/blog/id
 * @access private
 */
exports.deleteBlog = asyncHandler(async (req, res) => {
    const blog = await Blog.findById(
        req.params.id
    )

    if (!blog || blog.user_id != req.user._id) {
        res.status(404)
        throw new Error("Blog not found!")
    }

    await blog.deleteOne()
    res.status(200).json(blog)


})