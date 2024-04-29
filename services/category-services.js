// 載入操作資料表 Model
const { Category } = require('../models')

const categoryServices = {
  getCategories: (req, cb) => {
    Promise.all([
      Category.findAll({ raw: true }),
      req.params.id ? Category.findByPk(req.params.id, { raw: true }) : null
    ])
      .then(([categories, category]) => cb(null, { categories, category }))
      .catch(err => cb(err))
  },
  postCategory: (req, cb) => {
    const { name } = req.body
    // 判斷傳入的類別 name 是否存在
    if (!name) throw new Error('Category name is required!')
    return Category.create({ name })
      .then(newCategory => cb(null, { category: newCategory }))
      .catch(err => cb(err))
  },
  putCategory: (req, cb) => {
    const { name } = req.body
    // 判斷傳入的類別 name 是否存在
    if (!name) throw new Error('Category name is required!')
    return Category.findByPk(req.params.id)
      .then(category => {
        // 判斷類別是否存在
        if (!category) throw new Error('類別不存在!')
        return category.update({ name })
      })
      .then(editedCategory => cb(null, { category: editedCategory }))
      .catch(err => cb(err))
  },
  deleteCategory: (req, cb) => {
    return Category.findByPk(req.params.id)
      .then(category => {
        // 反查，確認要刪除的類別存在，再進行下面刪除動作
        if (!category) throw new Error('類別不存在!')
        return category.destroy()
      })
      .then(deletedCategory => cb(null, { category: deletedCategory }))
      .catch(err => cb(err))
  }
}

module.exports = categoryServices
