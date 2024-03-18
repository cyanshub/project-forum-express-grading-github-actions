const express = require('express')
const router = express.Router()

// 載入 controller
const adminController = require('../../controllers/admin-controller')

router.get('/restaurants/create', adminController.createRestaurant)
router.get('/restaurants', adminController.getRestaurants)
router.post('/restaurants', adminController.postRestaurant)
router.get('/restaurants/:id', adminController.getRestaurant)

router.use('/', (req, res) => res.redirect('/admin/restaurants'))

module.exports = router
