const express = require('express')
const router = express.Router()
const admin = require('./modules/admin.js')

// 載入 middleware
const passport = require('../../config/passport.js')
const { authenticated, authenticatedAdmin } = require('../../middleware/api-auth.js')
const { apiErrorHandler } = require('../../middleware/error-handler.js')

// 載入 controller
const restController = require('../../controllers/apis/restaurant-controller')
const userController = require('../../controllers/apis/user-controller.js')

// 設計路由
// 設計路由:後台區域
router.use('/admin', authenticated, authenticatedAdmin, admin)

// 設計路由: 登入相關(關閉 passport 的 session 功能)
router.post('/signin', passport.authenticate('local', { session: false }), userController.signIn)
router.post('/signup', userController.signUp)

// 設計路由: 餐廳相關
router.get('/restaurants', authenticated, restController.getRestaurants)

// 設計路由: 留言功能相關

// 設計路由: 使用者相關

// 設計路由: 錯誤相關
router.use('/', apiErrorHandler)

module.exports = router
