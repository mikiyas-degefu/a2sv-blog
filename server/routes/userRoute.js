const express = require('express')
const router = express.Router()
const { registerUser, login } = require('../controllers/userController')

router.route('/').post(registerUser)
router.route('/login').get(login)


module.exports = router