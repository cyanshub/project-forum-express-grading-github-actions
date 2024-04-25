const restaurantServices = require('../../services/restaurant-services')

const restaurantController = {
  getRestaurants: (req, res, next) => {
    restaurantServices.getRestaurants(req, (err, data) => err ? next(err) : res.json({ status: 'success', data }))
  },
  getFeeds: (req, res, next) => {
    res.send('開發中')
  },
  getTopRestaurants: (req, res, next) => {
    res.send('開發中')
  },
  getRestaurant: (req, res, next) => {
    res.send('開發中')
  },
  getDashboard: (req, res, next) => {
    res.sned('開發中')
  }
}

module.exports = restaurantController
