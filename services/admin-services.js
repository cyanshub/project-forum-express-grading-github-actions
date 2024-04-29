// 載入操作資料表的 model
const { Restaurant, Category, User } = require('../models')

// 載入所需的工具
const { getOffset, getPagination } = require('../helpers/pagination-helper')
const { localFileHandler } = require('../helpers/file-helpers.js')

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
  postRestaurant: (req, cb) => {
    const { name, tel, address, openingHours, description, categoryId } = req.body
    // 因為 name 設定為必填, 故設定檢驗條件
    if (!name) throw new Error('Restaurant name is required!')

    // 處理 multer 傳入的檔案
    const file = req.file
    return localFileHandler(file)
      .then(filePath => Restaurant.create({
        name,
        tel,
        address,
        openingHours,
        description,
        image: filePath || null,
        categoryId
      }))
      .then(newRestaurant => cb(null, { restaurant: newRestaurant }))
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
  },
  getRestaurant: (req, cb) => {
    Restaurant.findByPk(req.params.id, {
      nest: true,
      include: [Category],
      raw: true
    })
      .then(restaurant => {
        if (!restaurant) throw new Error("Restaurant didn't exist!")
        cb(null, { restaurant })
      })
      .catch(err => { cb(err) })
  },
  putRestaurant: (req, cb) => {
    const { name, tel, address, openingHours, description, categoryId } = req.body
    // 因為 name 設定為必填, 故設定檢驗條件
    if (!name) throw new Error('Restaurant name is required!')

    // 處理 multer 傳入的檔案
    const file = req.file

    // 使用 Promise.all 語法, 待所有非同步事件處理完才跳入下一個.then()
    // Promise.all([非同步A, 非同步B]).then(([A結果, B結果]) => {...})
    Promise.all([
      Restaurant.findByPk(req.params.id),
      localFileHandler(file)
    ])
      .then(([restaurant, filePath]) => {
        if (!restaurant) throw new Error("Restaurant didn't exist!")
        return restaurant.update({
          name,
          tel,
          address,
          openingHours,
          description,
          image: filePath || restaurant.image,
          categoryId
        })
      })
      .then(editedRestaurant => cb(null, { restaurant: editedRestaurant })
      )
      .catch(err => cb(err))
  },
  getUsers: (req, cb) => {
    return User.findAll({
      // 避免密碼外洩
      attributes: { exclude: ['password'] },
      raw: true
    })
      .then(users => {
        cb(null, { users })
      })
      .catch(err => cb(err))
  },
  patchUser: (req, cb) => {
    return User.findByPk(req.params.id, {
      // 避免密碼資料外洩
      attributes: { exclude: ['password'] }
    })
      .then(user => {
        // 檢查使用者是否存在
        if (!user) throw new Error("User didn't exist!")
        if (user.email === 'root@example.com') {
          const err = new Error('error_messages', '禁止變更 root 使用者權限!')
          err.status = 404
          throw err
        }
        return user.update({
          isAdmin: !user.isAdmin
        })
      })
      .then(editedUser => cb(null, { user: editedUser }))
      .catch(err => cb(err))
  }
}
module.exports = adminServices
