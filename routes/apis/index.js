const express = require('express')
const router = express.Router()

// 載入 controller
const restController = require('../../controllers/apis/restaurant-controller')

// 載入 middleware

// 設計路由
router.get('/restaurants', restController.getRestaurants)

module.exports = router
