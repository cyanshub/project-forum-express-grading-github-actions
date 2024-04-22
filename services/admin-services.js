// 載入操作資料表的 model
const { Restaurant, Category } = require('../models')

// 載入所需的工具
const { getOffset, getPagination } = require('../helpers/pagination-helper')

const adminServices = {
  getRestaurants: (req, cb) => {
    const DEFAULT_LIMIT = 10
    const categoryId = Number(req.query.categoryId) || ''
    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || DEFAULT_LIMIT
    const offset = getOffset(limit, page)
    return Promise.all([
      Restaurant.findAndCountAll({
        where: { ...categoryId ? { categoryId } : {} },
        offset,
        limit,
        raw: true,
        nest: true,
        order: [['id', 'DESC']],
        include: [Category] // 查資料時, 由 include 把有關資料資料一併帶出
      }),
      Category.findAll({ raw: true })
    ])
      .then(([restaurants, categories]) => {
        return cb(null, {
          restaurants: restaurants.rows,
          categories,
          categoryId,
          pagination: getPagination(limit, page, restaurants.count)

        })
      })
      .catch(err => cb(err))
  },
  deleteRestaurant: (req, cb) => {
    return Restaurant.findByPk(req.params.id)
      .then(restaurant => {
        if (!restaurant) {
          const err = new Error("Restaurant didn't exist!")
          err.status = 404
          throw err
        }
        return restaurant.destroy()
      })
      .then(deletedRestaurant => cb(null, { restaurant: deletedRestaurant }))
      .catch(err => cb(err))
  }
}
module.exports = adminServices
