// 載入專案所需的工具
const bcrypt = require('bcryptjs') // 載入 bcrypt
const { localFileHandler } = require('../helpers/file-helpers')
const { filterUnique } = require('../helpers/array-helpers')

// 載入所需的資料表 model
const { User, Comment, Restaurant, Favorite, Like, Followship } = require('../models')

const userServices = {
  signUpPage: (req, cb) => {
    return cb(null)
  },
  signUp: (req, cb) => {
    // 核對密碼與二次輸入密碼
    if (req.body.password !== req.body.passwordCheck) {
      throw new Error('Passwords do not match!')
    }

    // 判斷使用者帳號是否被註冊過!? 操作資料表尋找email看看
    return User.findOne({ where: { email: req.body.email } })
      .then(user => {
        if (user) { throw new Error('Email already exists!') }
        return bcrypt.hash(req.body.password, 10)
      })
      .then(hash => User.create({
        name: req.body.name,
        email: req.body.email,
        password: hash
      }))
      .then(newUser => cb(null, { user: newUser }))
      .catch(err => cb(err))
  },
  signInPage: (req, cb) => {
    return cb(null)
  },
  signIn: (req, cb) => {
    return cb(null)
  },
  logout: (req, cb) => {
    return cb(null)
  },

  getUser: (req, cb) => {
    return User.findByPk(req.params.id, {
      attributes: { exclude: ['password'] },
      include: [
        { model: Comment, include: [Restaurant] },
        { model: Restaurant, as: 'FavoritedRestaurants' },
        { model: User, as: 'Followings', attributes: { exclude: ['password'] } }, // 訂閱別人
        { model: User, as: 'Followers', attributes: { exclude: ['password'] } } // 粉絲
      ]
    })
      .then(user => {
        if (!user) throw new Error('使用者不存在!')
        // 整理 user.Comments 資料
        user.Comments = user.Comments.map(comment => ({
          ...comment.toJSON()
        }))
        user = user.toJSON() // 整理 user 資料

        // 使用重複值過濾演算法: 過濾掉重複的 comment.Restaurant.id
        user.Comments = filterUnique(user.Comments, ['Restaurant', 'id'])

        return cb(null, { user })
      })
      .catch(err => cb(err))
  },
  editUser: (req, cb) => {
    return User.findByPk(req.params.id, {
      raw: true,
      attributes: { exclude: ['password'] }
    })
      .then(user => {
        if (!user) throw new Error('使用者不存在!')
        return cb(null, { user })
      })
      .catch(err => cb(err))
  },
  putUser: (req, cb) => {
    // 使用者只能編輯自己的資料: 比對傳入的id 與 passport的id
    if (Number(req.params.id) !== req.user.id) throw new Error('只能編輯自己的使用者資料!')
    const { name } = req.body
    if (!name.trim()) throw new Error('需要輸入使用者名稱!')
    const file = req.file // 拿取 middleware 傳過來的檔案
    return Promise.all([
      User.findByPk(req.params.id, {
        attributes: { exclude: ['password'] }
      }),
      localFileHandler(file) // 將圖案寫入指定資料夾, 並回傳圖檔路徑
    ])
      .then(([user, filePath]) => {
        // 檢查使用者是否存在
        if (!user) throw new Error('使用者不存在!')
        return user.update({
          name,
          image: filePath || user.image
        })
      })
      .then(updatedUser => cb(null, { user: updatedUser }))
      .catch(err => cb(err))
  },
  addFavorite: (req, cb) => {
    const userId = req.user.id
    const restaurantId = req.params.restaurantId
    return Promise.all([
      Restaurant.findByPk(restaurantId, {
        // 取出關聯 model, 更新收藏數
        include: [{ model: User, as: 'FavoritedUsers', attributes: { exclude: ['password'] } }]
      }),
      Favorite.findOne({
        where: {
          userId,
          restaurantId
        }
      })
    ])
      .then(([restaurant, favorite]) => {
        if (!restaurant) throw new Error('該餐廳不存在!')
        if (favorite) throw new Error('已收藏過此餐廳!') // 檢查若能在join table 找到對應關係代表已經收藏過
        restaurant.update({
          // 新增收藏時, 追蹤數 + 1
          favoriteCounts: restaurant.FavoritedUsers.length + 1
        })
        return Favorite.create({
          userId,
          restaurantId
        })
      })
      .then(newFavrite => cb(null, { favorite: newFavrite }))
      .catch(err => cb(err))
  },
  removeFavorite: (req, cb) => {
    const userId = req.user.id
    const restaurantId = req.params.restaurantId
    return Promise.all([
      Restaurant.findByPk(restaurantId, {
        // 取出關聯 model, 更新收藏數
        include: [{ model: User, as: 'FavoritedUsers', attributes: { exclude: ['password'] } }]
      }),
      Favorite.findOne({
        where: {
          userId,
          restaurantId
        }
      })
    ])
      .then(([restaurant, favorite]) => {
        if (!restaurant) throw new Error('該餐廳不存在!')
        if (!favorite) throw new Error('並未收藏此餐廳')
        restaurant.update({
          // 移除收藏時, 追蹤數 - 1
          favoriteCounts: restaurant.FavoritedUsers.length < 1 ? 0 : restaurant.FavoritedUsers.length - 1 // 防護機制
        })
        return favorite.destroy()
      })
      .then(deletedFavorite => cb(null, { favorite: deletedFavorite }))
      .catch(err => cb(err))
  },
  addLike: (req, cb) => {
    const restaurantId = req.params.restaurantId
    const userId = req.user.id
    return Promise.all([
      Restaurant.findByPk(restaurantId),
      Like.findOne({
        where: {
          restaurantId,
          userId
        }
      })
    ])
      .then(([restaurant, like]) => {
        if (!restaurant) throw new Error('該餐廳不存在!')
        if (like) throw new Error('已對該餐廳點擊喜歡!')
        return Like.create({
          restaurantId,
          userId
        })
      })
      .then(newLike => cb(null, { like: newLike }))
      .catch(err => cb(err))
  },
  removeLike: (req, cb) => {
    const restaurantId = req.params.restaurantId
    const userId = req.user.id
    return Promise.all([
      Restaurant.findByPk(restaurantId),
      Like.findOne({
        where: {
          restaurantId,
          userId
        }
      })
    ])
      .then(([restaurant, like]) => {
        if (!restaurant) throw new Error('該餐廳不存在!')
        if (!like) throw new Error('並未對該餐廳點擊喜歡!')
        return like.destroy()
      })
      .then(deletedLike => cb(null, { like: deletedLike }))
      .catch(err => cb(err))
  },
  addFollowing: (req, cb) => {
    const followingId = req.params.userId
    const followerId = req.user.id
    return Promise.all([
      User.findByPk(followingId),
      Followship.findOne({
        where: {
          followingId,
          followerId
        }
      })
    ])
      .then(([user, followship]) => {
        if (!user) throw new Error('要追蹤的使用者不存在!')
        if (followship) throw new Error('已追蹤過該名使用者!')
        return Followship.create({ followingId, followerId })
      })
      .then(newFollowShip => cb(null, { followship: newFollowShip }))
      .catch(err => cb(err))
  },
  removeFollowing: (req, cb) => {
    const followingId = req.params.userId
    const followerId = req.user.id
    return Promise.all([
      User.findByPk(followingId),
      Followship.findOne({
        where: {
          followingId,
          followerId
        }
      })
    ])
      .then(([user, followship]) => {
        if (!user) throw new Error('要追蹤的使用者不存在!')
        if (!followship) throw new Error('尚未追蹤過該名使用者!')
        return followship.destroy()
      })
      .then(deletedFollowship => cb(null, { followship: deletedFollowship }))
      .catch(err => cb(err))
  },
  getTopUsers: (req, cb) => {
    const userAuthId = req.user.id
    return Promise.all([
      User.findAll({
        // 避免密碼外洩
        attributes: { exclude: ['password'] },
        include: [{ model: User, as: 'Followers', attributes: { exclude: ['password'] } }] // 取出追蹤此user的人
      }),
      User.findByPk(userAuthId, {
        attributes: { exclude: ['password'] },
        include: [{ model: User, as: 'Followings' }] // 關聯自己追蹤的使用者
      })
    ])
      .then(([users, userAuth]) => {
        const result = users
          // 傳入的 map 函式記得用小括號包住
          .map(user => ({
            ...user.toJSON(), // 使用展開運算子倒入 map 函式傳入的 user 屬性
            followerCount: user.Followers.length, // 傳入的使用者與其追隨自己的數量
            isFollowed: userAuth.Followings.some(f => f.id === user.id)
            // 判斷目前登入的使用者帳戶的追蹤者名單是否包含傳入的使用者
          }))
          // 利用.sort箭頭函式排序(a,b): 由大到小 b - a; 由小到大 a - b
          .sort((a, b) => b.followerCount - a.followerCount)
        return cb(null, { users: result })
      })
      .catch(err => cb(err))
  }
}

module.exports = userServices
