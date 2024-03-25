// 載入操作資料表所需的 Model
const { Restaurant, Category } = require('../models')
const { getOffset, getPagination } = require('../helpers/pagination-helper')

const restaurantController = {
  getRestaurants: (req, res, next) => {
    const DEFAULT_LIMIT = 9 // 預設每頁顯示幾筆資料
    const categoryId = Number(req.query.categoryId) || ''
    const page = Number(req.query.page) || 1 // 預設第一頁或從query string拿資料
    const limit = Number(req.query.limit) || DEFAULT_LIMIT // 預設每頁顯示資料數或從query string拿資料
    const offset = getOffset(limit, page)
    return Promise.all([
      Restaurant.findAndCountAll({
        raw: true,
        where: {
          // 展開運算子的優先級較低, 會比較慢判斷
          // 若 categoryId 存在, 則展開 {categoryId}; 若不存在則展開 {}
          ...categoryId ? { categoryId } : {}
        },
        offset,
        limit,
        include: [Category],
        nest: true
      }),
      Category.findAll({ raw: true })
    ])
      .then(([restaurants, categories]) => {
        const data = restaurants.rows.map(r => ({
          ...r,
          description: r.description.substring(0, 50)
        }))
        return res.render('restaurants', {
          restaurants: data,
          categories,
          categoryId,
          pagination: getPagination(limit, page, restaurants.count)
        })
      })
      .catch(err => next(err))
  },
  getRestaurant: (req, res, next) => {
    return Restaurant.findByPk(req.params.id, {
      include: [Category] // 拿出關聯的 Category model
    })
      .then(restaurant => {
        if (!restaurant) throw new Error("Restaurant didn't exist!")
        // 每次查詢時, 使資料的 viewCounts + 1
        restaurant.increment('viewCounts', { by: 1 })
        return restaurant.toJSON()
      })
      .then(restaurant => res.render('restaurant', { restaurant }))
      .catch(err => next(err))
  },
  getDashboard: (req, res, next) => {
    // res.render('restaurant-dashboard')
    return Restaurant.findByPk(req.params.id, {
      raw: true,
      include: [Category],
      nest: true
    })
      .then(restaurant => {
        if (!restaurant) throw new Error("Restaurant didn't exist!")
        res.render('restaurant-dashboard', { restaurant })
      })
      .catch(err => next(err))
  }
}
module.exports = restaurantController
