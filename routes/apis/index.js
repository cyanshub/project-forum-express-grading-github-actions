const express = require('express')
const router = express.Router()
const admin = require('./modules/admin.js')

// 載入 middleware
const passport = require('../../config/passport.js')
const { authenticated, authenticatedAdmin } = require('../../middleware/api-auth.js')
const { apiErrorHandler } = require('../../middleware/error-handler.js')
const upload = require('../../middleware/multer.js')

// 載入 controller
const restController = require('../../controllers/apis/restaurant-controller')
const userController = require('../../controllers/apis/user-controller.js')
const commentController = require('../../controllers/apis/comment-controller')

// 設計路由
// 設計路由:後台區域
router.use('/admin', authenticated, authenticatedAdmin, admin)

// 設計路由: 餐廳相關
router.get('/restaurants', authenticated, restController.getRestaurants)
router.get('/restaurants/feeds', authenticated, restController.getFeeds)
router.get('/restaurants/top', authenticated, restController.getTopRestaurants)
router.get('/restaurants/:id', authenticated, restController.getRestaurant)
router.get('/restaurants/:id/dashboard', authenticated, restController.getDashboard)

// 設計路由: 留言功能相關
router.post('/comments', authenticated, commentController.postComment)
router.delete('/comments/:id', authenticated, commentController.deleteComment)

// 設計路由: 使用者相關
// 設計路由: 登入相關(關閉 passport 的 session 功能)
router.post('/signup', userController.signUp)
router.post('/signin', passport.authenticate('local', { session: false }), userController.signIn)
router.post('/favorite/:restaurantId', authenticated, userController.addFavorite)
router.delete('/favorite/:restaurantId', authenticated, userController.removeFavorite)
router.post('/like/:restaurantId', authenticated, userController.addLike)
router.delete('/like/:restaurantId', authenticated, userController.removeLike)
router.post('/following/:userId', authenticated, userController.addFollowing)
router.delete('/following/:userId', authenticated, userController.removeFollowing)
router.get('/users/top', authenticated, userController.getTopUsers)
router.get('/users/:id', authenticated, userController.getUser)
router.put('/users/:id', authenticated, upload.single('image'), userController.putUser)

// 設計路由: 錯誤相關
router.use('/', apiErrorHandler)

module.exports = router
