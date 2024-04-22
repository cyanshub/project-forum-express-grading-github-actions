const express = require('express')
const router = express.Router()

const admin = require('./modules/admin.js')

// 載入 controller
const restController = require('../../controllers/apis/restaurant-controller')

// 載入 middleware
const { apiErrorHandler } = require('../../middleware/error-handler.js')
router.use('/admin', admin)

// 設計路由
router.get('/restaurants', restController.getRestaurants)
router.use('/', apiErrorHandler)

module.exports = router
