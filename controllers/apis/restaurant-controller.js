const restaurantServices = require('../../services/restaurant-services')

const restaurantController = {
  getRestaurants: (req, res, next) => {
    return restaurantServices.getRestaurants(req, (err, data) => err ? next(err) : res.status(200).json({ status: 'success', data }))
  },

  getFeeds: (req, res, next) => {
    return restaurantServices.getFeeds(req, (err, data) => err ? next(err) : res.status(200).json({ status: 'success', data }))
  },

  getTopRestaurants: (req, res, next) => {
    return restaurantServices.getTopRestaurants(req, (err, data) => err ? next(err) : res.status(200).json({ status: 'success', data }))
  },

  getRestaurant: (req, res, next) => {
    return restaurantServices.getRestaurant(req, (err, data) => err ? next(err) : res.status(200).json({ status: 'success', data }))
  },

  getDashboard: (req, res, next) => {
    return restaurantServices.getDashboard(req, (err, data) => err ? next(err) : res.status(200).json({ status: 'success', data }))
  }
}

module.exports = restaurantController
