const express = require('express')
const router = express.Router()
const { addComment } = require('../controllers/commentController')
const validateToken = require('../middleware/validateTokenHandler')

router.route('/').post(validateToken, addComment)

module.exports = router