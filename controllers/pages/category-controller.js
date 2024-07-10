// 載入 service 層
const categoryServices = require('../../services/category-services')

const categoryController = {
  getCategories: (req, res, next) => {
    return categoryServices.getCategories(req, (err, data) => {
      if (err) next(err)
      return res.render('admin/categories', data)
    })
  },
  postCategory: (req, res, next) => {
    return categoryServices.postCategory(req, (err, data) => {
      if (err) next(err)
      req.flash('success_messages', '成功新增類別!')
      return res.redirect('/admin/categories')
    })
  },
  putCategory: (req, res, next) => {
    return categoryServices.putCategory(req, (err, data) => {
      if (err) next(err)
      req.flash('success_messages', '成功更新類別!')
      return res.redirect('/admin/categories')
    })
  },
  deleteCategory: (req, res, next) => {
    return categoryServices.deleteCategory(req, (err, data) => {
      if (err) next(err)
      req.flash('success_messages', '成功刪除類別!')
      return res.redirect('/admin/categories')
    })
  }
}

module.exports = categoryController
