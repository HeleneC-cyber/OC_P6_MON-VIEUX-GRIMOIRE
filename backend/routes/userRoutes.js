const express = require('express')
const router = express.Router()
const userController = require('../controllers/userController')
const { signUpLimiter, loginAccountLimiter } = require('../middlewares/limiter')



router.post('/signup', signUpLimiter, userController.signup)
router.post('/login', loginAccountLimiter, userController.login)



module.exports = router