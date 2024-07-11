// 載入共用的 services 層
const categoryServices = require('../../services/category-services')

const categoryController = {
  getCategories: (req, res, next) => {
    return categoryServices.getCategories(req, (err, data) => err ? next(err) : res.status(200).json({ status: 'success', data }))
  },

  postCategory: (req, res, next) => {
    return categoryServices.postCategory(req, (err, data) => err ? next(err) : res.status(200).json({ status: 'success', data }))
  },

  putCategory: (req, res, next) => {
    return categoryServices.putCategory(req, (err, data) => err ? next(err) : res.status(200).json({ status: 'success', data }))
  },

  deleteCategory: (req, res, next) => {
    return categoryServices.deleteCategory(req, (err, data) => err ? next(err) : res.status(200).json({ status: 'success', data }))
  }
}

module.exports = categoryController
