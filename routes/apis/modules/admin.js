const express = require('express')
const router = express.Router()

// 載入 middleware
const upload = require('../../../middleware/multer.js')

// 載入 controller
const adminController = require('../../../controllers/apis/admin-controller')

// 設計路由
router.get('/restaurants', adminController.getRestaurants)
router.post('/restaurants', upload.single('image'), adminController.postRestaurant)
router.delete('/restaurants/:id', adminController.deleteRestaurant)

module.exports = router
