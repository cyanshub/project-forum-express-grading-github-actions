const express = require('express')
const router = express.Router()
const admin = require('./modules/admin')

// 載入 middleware
// 載入 middleware:  passport 負責登入驗證
const passport = require('../../config/passport')
// 載入 middleware: 處理身分驗證的 middleware
const { authenticated, authenticatedAdmin } = require('../../middleware/auth')
// 載入 middleware: 處理圖片上傳
const upload = require('../../middleware/multer')
// 載入處理錯誤的 middleware
const { generalErrorHandler } = require('../../middleware/error-handler')

// 載入 controller
const restController = require('../../controllers/pages/restaurant-controller')
const userController = require('../../controllers/pages/user-controller')
const commentController = require('../../controllers/pages/comment-controller')

// 設計路由
// 設計路由:後台區域
router.use('/admin', authenticatedAdmin, admin)

// 設計路由: 使用者登入相關
router.get('/signup', userController.signUpPage)
router.post('/signup', userController.signUp)
router.get('/signin', userController.signInPage)
router.post('/signin', passport.authenticate('local', { failureRedirect: '/signin', failureFlash: true }), userController.signIn)
router.get('/logout', userController.logout)

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
router.post('/favorite/:restaurantId', authenticated, userController.addFavorite)
router.delete('/favorite/:restaurantId', authenticated, userController.removeFavorite)
router.post('/like/:restaurantId', authenticated, userController.addLike)
router.delete('/like/:restaurantId', authenticated, userController.removeLike)
router.post('/following/:userId', authenticated, userController.addFollowing)
router.delete('/following/:userId', authenticated, userController.removeFollowing)
router.get('/users/top', authenticated, userController.getTopUsers)
router.get('/users/:id', authenticated, userController.getUser)
router.get('/users/:id/edit', authenticated, userController.editUser)
router.put('/users/:id', authenticated, upload.single('image'), userController.putUser)

// 設計路由: 錯誤相關
router.get('/', (req, res) => res.redirect('/restaurants'))
router.use('/', generalErrorHandler)

module.exports = router
