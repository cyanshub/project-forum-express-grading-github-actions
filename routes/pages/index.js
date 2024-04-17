const express = require('express')
const router = express.Router()
const passport = require('../../config/passport') // 引入 passport 負責登入驗證
const admin = require('./modules/admin')

// 載入 controller
const restController = require('../../controllers/pages/restaurant-controller')
const userController = require('../../controllers/pages/user-controller')
const commentController = require('../../controllers/pages/comment-controller')

// 載入處理身分驗證的 middleware
const { authenticated, authenticatedAdmin } = require('../../middleware/auth')

// 處理圖片上傳的 middleware
const upload = require('../../middleware/multer')

// 載入處理錯誤的 middleware
const { generalErrorHandler } = require('../../middleware/error-handler')

router.use('/admin', authenticatedAdmin, admin)
router.get('/signup', userController.signUpPage)
router.post('/signup', userController.signUp)

router.get('/signin', userController.signInPage)
router.post('/signin', passport.authenticate('local', { failureRedirect: '/signin', failureFlash: true }), userController.signIn) // 注意路由方法是 POST
router.get('/logout', userController.logout)

// 在路由加入身分驗證的 middleware
router.get('/restaurants', authenticated, restController.getRestaurants)
router.get('/restaurants/feeds', authenticated, restController.getFeeds)
router.get('/restaurants/top', authenticated, restController.getTopRestaurants)
router.get('/restaurants/:id', authenticated, restController.getRestaurant)
router.get('/restaurants/:id/dashboard', authenticated, restController.getDashboard)

// 留言功能
router.post('/comments', authenticated, commentController.postComment)
router.delete('/comments/:id', authenticated, commentController.deleteComment)

// 收藏功能
router.post('/favorite/:restaurantId', authenticated, userController.addFavorite)
router.delete('/favorite/:restaurantId', authenticated, userController.removeFavorite)

// Like/ Unlike 功能
router.post('/like/:restaurantId', authenticated, userController.addLike)
router.delete('/like/:restaurantId', authenticated, userController.removeLike)

// 追蹤使用者功能
router.post('/following/:userId', authenticated, userController.addFollowing)
router.delete('/following/:userId', authenticated, userController.removeFollowing)

// 使用者相關
router.get('/users/top', authenticated, userController.getTopUsers)
router.get('/users/:id', authenticated, userController.getUser)
router.get('/users/:id/edit', authenticated, userController.editUser)
router.put('/users/:id', authenticated, upload.single('image'), userController.putUser)

router.get('/', (req, res) => res.redirect('/restaurants'))

router.use('/', generalErrorHandler)

module.exports = router
