const express = require('express')
const router = express.Router()
const { addBlog, getAllBlogs } = require('../controllers/blogController')
const validateToken = require('../middleware/validateTokenHandler')
const roleMiddleware = require('../middleware/roleMiddleware')

router.route('/').post(validateToken, addBlog).get(validateToken, getAllBlogs)

module.exports = router