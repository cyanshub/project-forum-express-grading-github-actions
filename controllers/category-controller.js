// 載入操作資料表 Model
const { Category } = require('../models')
const categoryController = {
  getCategories: (req, res, next) => {
    Promise.all([
      Category.findAll({ raw: true }),
      req.params.id ? Category.findByPk(req.params.id, { raw: true }) : null
    ])
      .then(([categories, category]) => {
        res.render('admin/categories', { categories, category })
      })
      .catch(err => next(err))
  },
  postCategory: (req, res, next) => {
    const { name } = req.body
    // 判斷傳入的類別 name 是否存在
    if (!name) throw new Error('Category name is required!')
    return Category.create({ name })
      .then(() => {
        req.flash('success_messages', '成功新增類別!')
        return res.redirect('/admin/categories')
      })
      .catch(err => next(err))
  },
  putCategory: (req, res, next) => {
    const { name } = req.body
    // 判斷傳入的類別 name 是否存在
    if (!name) throw new Error('Category name is required!')
    return Category.findByPk(req.params.id)
      .then(category => {
        // 判斷類別是否存在
        if (!category) throw new Error('類別不存在!')
        return category.update({ name })
      })
      .then(() => {
        req.flash('success_messages', '成功更新類別!')
        return res.redirect('/admin/categories')
      })
      .catch(err => next(err))
  }
}

module.exports = categoryController
