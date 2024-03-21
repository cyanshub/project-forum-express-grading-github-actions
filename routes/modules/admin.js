const express = require('express')
const router = express.Router()

// 載入 controller
const adminController = require('../../controllers/admin-controller')
const categoryController = require('../../controllers/category-controller')

const upload = require('../../middleware/multer')

router.get('/restaurants/create', adminController.createRestaurant)
router.get('/restaurants', adminController.getRestaurants)
router.post('/restaurants', upload.single('image'), adminController.postRestaurant)
router.get('/restaurants/:id', adminController.getRestaurant)
router.get('/restaurants/:id/edit', adminController.editRestaurant)
router.put('/restaurants/:id', upload.single('image'), adminController.putRestaurant)
router.delete('/restaurants/:id', adminController.deleteRestaurant)

// 第一次作業的部分
router.get('/users', adminController.getUsers)
router.patch('/users/:id', adminController.patchUser)

// 分類相關
router.get('/categories', categoryController.getCategories)
router.post('/categories', categoryController.postCategory)

router.get('/categories/:id', categoryController.getCategories)
router.put('/categories/:id', categoryController.putCategory)

router.delete('/categories/:id', categoryController.deleteCategory)

router.use('/', (req, res) => res.redirect('/admin/restaurants'))

module.exports = router
