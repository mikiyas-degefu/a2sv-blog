const express = require('express')
const router = express.Router()
const { addRating } = require('../controllers/blogRatingController')
const validateToken = require('../middleware/validateTokenHandler')

router.route('/').post(validateToken, addRating)

module.exports = router