// 載入操作資料表所需的 Model
const { Restaurant, Category, Comment, User } = require('../../models')
const restaurantServices = require('../../services/restaurant-services')

const restaurantController = {
  getRestaurants: (req, res, next) => {
    restaurantServices.getRestaurants(req, (err, data) => err ? next(err) : res.render('restaurants', data))
  },
  getRestaurant: (req, res, next) => {
    return Restaurant.findByPk(req.params.id, {
      include: [
        Category, // 拿出關聯的 Category model
        { model: Comment, include: User }, // 拿出關聯的 Comment model
        { model: User, as: 'FavoritedUsers' }, // 拿出關聯的 User model
        { model: User, as: 'LikedUsers' } // 拿出關聯的 User model
      ],
      order: [[Comment, 'createdAt', 'DESC']]
    })
      .then(restaurant => {
        if (!restaurant) throw new Error("Restaurant didn't exist!")
        // 每次查詢時, 使資料的 viewCounts + 1
        if (!restaurant.viewCounts) { return restaurant.update({ viewCounts: 1 }) }
        return restaurant.increment('viewCounts', { by: 1 })
      })
      .then(restaurant => {
        const isFavorited = restaurant.FavoritedUsers.some(f => f.id === req.user.id)
        const isLiked = restaurant.LikedUsers.some(f => f.id === req.user.id)
        return res.render('restaurant', { restaurant: restaurant.toJSON(), isFavorited, isLiked })
      })
      .catch(err => next(err))
  },
  getDashboard: (req, res, next) => {
    return Restaurant.findByPk(req.params.id, {
      include: [Category, Comment, { model: User, as: 'FavoritedUsers' }]
    })
      .then(restaurant => {
        if (!restaurant) throw new Error("Restaurant didn't exist!")
        return restaurant.update({
          commentCounts: restaurant.Comments ? restaurant.Comments.length : [], // 評論數
          favoriteCounts: restaurant.FavoritedUsers ? restaurant.FavoritedUsers.length : [] // 收藏數
        })
      })
      .then(restaurant => res.render('restaurant-dashboard', { restaurant: restaurant.toJSON() }))
      .catch(err => next(err))
  },
  getFeeds: (req, res, next) => {
    return Promise.all([
      Restaurant.findAll({
        limit: 10, // 只取前10筆資料
        order: [['createdAt', 'DESC']], // 陣列第一個參數可指定關聯model, 若無可省略; 可放入多組陣列
        include: [Category], // 陣列第一個參數可指定關聯model, 若無可省略; 可放入多組陣列
        raw: true,
        nest: true
      }),
      Comment.findAll({
        limit: 10, // 只取前10筆資料
        order: [['createdAt', 'DESC']],
        include: [User, Restaurant],
        raw: true,
        nest: true
      })
    ])
      .then(([restaurants, comments]) => {
        if (!restaurants) throw new Error("restaurants didn't exist")
        if (!comments) throw new Error("comments didn't exist")
        return res.render('feeds', { restaurants, comments })
      })
      .catch(err => next(err))
  },
  getTopRestaurants: (req, res, next) => {
    return Restaurant.findAll({
      include: [{ model: User, as: 'FavoritedUsers' }],
      limit: 10, // 只取前10筆資料
      order: [['favoriteCounts', 'DESC'], ['id', 'ASC']] // 依 favoriteCounts 降冪排列
    })
      .then(restaurants => {
        if (!restaurants) throw new Error("restaurants didn't exist")
        const results = restaurants.map(restaurant => ({
          ...restaurant.toJSON(), // toJSON無法針對陣列, 只能針對單個物件
          isFavorited: restaurant.FavoritedUsers.some(f => f.id === req.user.id)
        }))

        return res.render('top-restaurants', {
          restaurants: results
        })
      })
      .catch(err => next(err))
  }
}
module.exports = restaurantController
