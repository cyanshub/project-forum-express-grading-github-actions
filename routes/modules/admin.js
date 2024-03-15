const express = require('express')
const router = express.Router()

// 載入 controller
const adminController = require('../../controllers/admin-controller')

// 載入處理身分驗證的 middleware
const { authenticatedAdmin } = require('../../middleware/auth')

router.get('/restaurants', authenticatedAdmin, adminController.getRestaurants)
router.use('/', (req, res) => res.redirect('/admin/restaurants'))

module.exports = router
