const express = require('express')
const router = express.Router()
const passport = require('../config/passport') // 引入 passport 負責登入驗證
const admin = require('./modules/admin')

// 載入 controller
const restController = require('../controllers/restaurant-controller')
const userController = require('../controllers/user-controller')

// 載入處理錯誤的 middleware
const { generalErrorHandler } = require('../middleware/error-handler')

router.use('/admin', admin)
router.get('/signup', userController.signUpPage)
router.post('/signup', userController.signUp)

router.get('/signin', userController.signInPage)
router.post('/signin', passport.authenticate('local', { failureRedirect: '/signin', failureFlash: true }), userController.signIn) // 注意路由方法是 POST
router.get('/logout', userController.logout)

router.get('/restaurants', restController.getRestaurants)
router.get('/', (req, res) => res.redirect('/restaurants'))

router.use('/', generalErrorHandler)

module.exports = router
