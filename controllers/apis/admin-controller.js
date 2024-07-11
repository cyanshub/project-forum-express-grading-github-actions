// 載入共用 controller 的 services 層
const adminServices = require('../../services/admin-services')

const adminController = {
  getRestaurants: (req, res, next) => {
    return adminServices.getRestaurants(req, (err, data) => err ? next(err) : res.status(200).json({ status: 'success', data }))
  },

  postRestaurant: (req, res, next) => {
    return adminServices.postRestaurant(req, (err, data) => err ? next(err) : res.status(200).json({ status: 'success', data }))
  },

  deleteRestaurant: (req, res, next) => {
    return adminServices.deleteRestaurant(req, (err, data) => err ? next(err) : res.status(200).json({ status: 'success', data }))
  },

  getRestaurant: (req, res, next) => {
    return adminServices.getRestaurant(req, (err, data) => err ? next(err) : res.status(200).json({ status: 'success', data }))
  },

  putRestaurant: (req, res, next) => {
    return adminServices.putRestaurant(req, (err, data) => err ? next(err) : res.status(200).json({ status: 'success', data }))
  },

  getUsers: (req, res, next) => {
    return adminServices.getUsers(req, (err, data) => err ? next(err) : res.status(200).json({ status: 'success', data }))
  },

  patchUser: (req, res, next) => {
    return adminServices.patchUser(req, (err, data) => err ? next(err) : res.status(200).json({ status: 'success', data }))
  }
}

module.exports = adminController
