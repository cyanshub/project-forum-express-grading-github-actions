// 載入 services 層
const restaurantServices = require('../../services/restaurant-services')

const restaurantController = {
  getRestaurants: (req, res, next) => {
    return restaurantServices.getRestaurants(req, (err, data) => {
      if (err) next(err)
      return res.render('restaurants/restaurants', data)
    })
  },
  getRestaurant: (req, res, next) => {
    return restaurantServices.getRestaurant(req, (err, data) => {
      if (err) next(err)
      return res.render('restaurants/restaurant', data)
    })
  },
  getDashboard: (req, res, next) => {
    return restaurantServices.getDashboard(req, (err, data) => {
      if (err) next(err)
      return res.render('restaurants/dashboard', data)
    })
  },
  getFeeds: (req, res, next) => {
    return restaurantServices.getFeeds(req, (err, data) => {
      if (err) next(err)
      return res.render('restaurants/feeds', data)
    })
  },
  getTopRestaurants: (req, res, next) => {
    return restaurantServices.getTopRestaurants(req, (err, data) => {
      if (err) next(err)
      return res.render('restaurants/top-restaurants', data)
    })
  }
}
module.exports = restaurantController
