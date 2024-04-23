const express = require('express')
const router = express.Router()

const passport = require('../../config/passport.js')
const admin = require('./modules/admin.js')

// 載入 controller
const restController = require('../../controllers/apis/restaurant-controller')
const userController = require('../../controllers/apis/user-controller.js')

// 載入 middleware
const { authenticated, authenticatedAdmin } = require('../../middleware/api-auth.js')
const { apiErrorHandler } = require('../../middleware/error-handler.js')

// 設計路由
router.use('/admin', authenticated, authenticatedAdmin, admin)
router.get('/restaurants', authenticated, restController.getRestaurants)

// 登入的路由: 關閉 passport 的 session 功能
router.post('/signin', passport.authenticate('local', { session: false }), userController.signIn)
router.post('/signup', userController.signUp)

router.use('/', apiErrorHandler)

module.exports = router
