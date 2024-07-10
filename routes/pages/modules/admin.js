const express = require('express')
const router = express.Router()

// 載入 middleware
const upload = require('../../../middleware/multer')

// 載入 controller
const adminController = require('../../../controllers/pages/admin-controller')
const categoryController = require('../../../controllers/pages/category-controller')

// 設計後台路由
// 設計後台路由: 餐廳相關
router.get('/restaurants/create', adminController.createRestaurant)
router.get('/restaurants', adminController.getRestaurants)
router.post('/restaurants', upload.single('image'), adminController.postRestaurant)
router.get('/restaurants/:id', adminController.getRestaurant)
router.get('/restaurants/:id/edit', adminController.editRestaurant)
router.put('/restaurants/:id', upload.single('image'), adminController.putRestaurant)
router.delete('/restaurants/:id', adminController.deleteRestaurant)

// 設計後台路由: 使用者相關
router.get('/users', adminController.getUsers)
router.patch('/users/:id', adminController.patchUser)

// 設計後台路由: 分類相關
router.get('/categories', categoryController.getCategories)
router.post('/categories', categoryController.postCategory)
router.get('/categories/:id', categoryController.getCategories)
router.put('/categories/:id', categoryController.putCategory)
router.delete('/categories/:id', categoryController.deleteCategory)

router.use('/', (req, res) => res.redirect('/admin/restaurants'))

module.exports = router
