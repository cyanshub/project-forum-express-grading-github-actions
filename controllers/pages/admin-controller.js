// 載入 service 層
const adminServices = require('../../services/admin-services.js')

const adminController = {
  getRestaurants: (req, res, next) => {
    return adminServices.getRestaurants(req, (err, data) => {
      if (err) next(err)
      return res.render('admin/restaurants', data)
    })
  },
  createRestaurant: (req, res, next) => {
    return adminServices.createRestaurant(req, (err, data) => {
      if (err) next(err)
      return res.render('admin/create-restaurant', data)
    })
  },
  postRestaurant: (req, res, next) => {
    return adminServices.postRestaurant(req, (err, data) => {
      if (err) next(err)
      req.flash('success_messages', 'restaurant was successfully created!')
      return res.redirect('/admin/restaurants')
    })
  },
  getRestaurant: (req, res, next) => {
    return adminServices.getRestaurant(req, (err, data) => {
      if (err) next(err)
      return res.render('admin/restaurant', data)
    })
  },
  editRestaurant: (req, res, next) => {
    return adminServices.editRestaurant(req, (err, data) => {
      if (err) next(err)
      return res.render('admin/edit-restaurant', data)
    })
  },
  putRestaurant: (req, res, next) => {
    return adminServices.putRestaurant(req, (err, data) => {
      if (err) next(err)
      req.flash('success_messages', 'restaurant was successfully updated!')
      return res.redirect('/admin/restaurants')
    })
  },
  deleteRestaurant: (req, res, next) => {
    return adminServices.deleteRestaurant(req, (err, data) => {
      if (err) next(err)
      req.flash('success_messages', 'restaurant was successfully deleted!')
      return res.redirect('/admin/restaurants')
    })
  },
  getUsers: (req, res, next) => {
    return adminServices.getUsers(req, (err, data) => {
      if (err) next(err)
      return res.render('admin/users', data)
    })
  },
  patchUser: (req, res, next) => {
    return adminServices.patchUser(req, (err, data) => {
      if (err) next(err)
      req.flash('error_messages', '禁止變更 root 權限')
      return res.redirect('back')
    })
  }
}

module.exports = adminController
