const express = require('express')
const router = express.Router()
const { addBlog, getAllBlogs, updateBlog, deleteBlog } = require('../controllers/blogController')
const validateToken = require('../middleware/validateTokenHandler')
const roleMiddleware = require('../middleware/roleMiddleware')

router.route('/').post(validateToken, addBlog).get(validateToken, getAllBlogs)

router.route('/:id').put(validateToken, updateBlog).delete(validateToken, deleteBlog)
module.exports = router