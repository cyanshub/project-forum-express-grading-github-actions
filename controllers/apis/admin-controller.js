// 載入共用 controller 的 services 層
const adminServices = require('../../services/admin-services')

const adminController = {
  getRestaurants: (req, res, next) => {
    adminServices.getRestaurants(req, (err, data) => err ? next(err) : res.json({ status: 'success', data }))
  },
  postRestaurant: (req, res, next) => {
    adminServices.postRestaurant(req, (err, data) => err ? next(err) : res.json({ status: 'success', data }))
  },
  deleteRestaurant: (req, res, next) => {
    adminServices.deleteRestaurant(req, (err, data) => err ? next(err) : res.json({ status: 'success', data }))
  },
  getRestaurant: (req, res, next) => {
    res.send('開發中')
  },
  putRestaurant: (req, res, next) => {
    res.send('開發中')
  },
  getUsers: (req, res, next) => {
    res.send('開發中')
  },
  patchUser: (req, res, next) => {
    res.send('開發中')
  }
}

module.exports = adminController
