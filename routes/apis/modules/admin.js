const express = require('express')
const router = express.Router()

// 載入 middleware
const upload = require('../../../middleware/multer.js')

// 載入 controller
const adminController = require('../../../controllers/apis/admin-controller')
const categoryController = require('../../../controllers/apis/category-controller')

// 設計路由
// 設計路由: 後台相關
router.get('/restaurants', adminController.getRestaurants)
router.post('/restaurants', upload.single('image'), adminController.postRestaurant)
router.delete('/restaurants/:id', adminController.deleteRestaurant)
router.get('/restaurants/:id', adminController.getRestaurant)
router.put('/restaurants/:id', upload.single('image'), adminController.putRestaurant)
router.get('/users', adminController.getUsers)
router.patch('/users/:id', adminController.patchUser)

// 設計路由: 分類相關
router.get('/categories', categoryController.getCategories)
router.post('/categories', categoryController.postCategory)
router.put('/categories/:id', categoryController.putCategory)
router.delete('/categories/:id', categoryController.deleteCategory)

module.exports = router
