const express = require('express')
const router = express.Router()
const { addLike } = require('../controllers/likeController')
const validateToken = require('../middleware/validateTokenHandler')

router.route('/').post(validateToken, addLike)

module.exports = router