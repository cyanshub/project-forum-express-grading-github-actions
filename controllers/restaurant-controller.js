// 載入操作資料表所需的 Model
const { Restaurant, Category, Comment, User } = require('../models')
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
      include: [
        Category, // 拿出關聯的 Category model
        { model: Comment, include: User } // 拿出關聯的 Comment model
      ],
      order: [[Comment, 'createdAt', 'DESC']]
    })
      .then(restaurant => {
        if (!restaurant) throw new Error("Restaurant didn't exist!")
        // 每次查詢時, 使資料的 viewCounts + 1
        return restaurant.increment('viewCounts', { by: 1 })
      })
      .then(restaurant => res.render('restaurant', { restaurant: restaurant.toJSON() }))
      .catch(err => next(err))
  },
  getDashboard: (req, res, next) => {
    return Promise.all([
      Restaurant.findByPk(req.params.id, {
        include: [Category]
      }),
      Comment.findAndCountAll({
        where: { restaurantId: req.params.id }
      })
    ])
      .then(([restaurant, comments]) => {
        if (!restaurant) throw new Error("Restaurant didn't exist!")
        if (!comments) throw new Error('該餐廳尚無評論!')
        return restaurant.update({
          commentCounts: comments.count
        })
      })
      .then(restaurant => res.render('restaurant-dashboard', { restaurant: restaurant.toJSON() }))
      .catch(err => next(err))
  }
}
module.exports = restaurantController
