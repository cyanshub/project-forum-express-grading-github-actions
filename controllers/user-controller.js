const bcrypt = require('bcryptjs') // 載入 bcrypt
const db = require('../models')
const { localFileHandler } = require('../helpers/file-helpers')
const { User, Comment, Restaurant, Favorite, Like, Followship } = db

const userController = {
  signUpPage: (req, res) => {
    res.render('signup')
  },
  signUp: (req, res, next) => {
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
      .then(() => {
        req.flash('success_messages', '成功註冊帳號!')
        res.redirect('/signin')
      })
      .catch(err => next(err))
  },
  signInPage: (req, res) => {
    res.render('signin')
  },
  signIn: (req, res) => {
    req.flash('success_messages', '登入成功!')
    res.redirect('/restaurants')
  },
  logout: (req, res) => {
    req.flash('success_messages', '登出成功!')
    req.logout()
    res.redirect('/signin')
  },
  getUser: (req, res, next) => {
    return User.findByPk(req.params.id, {
      include: [{ model: Comment, include: [Restaurant] }]
    })
      .then(user => {
        if (!user) throw new Error('使用者不存在!')
        // 拿取使用者關聯評論時, 因為是1對多是複數s, 用nest: true時會被壓縮成只有一個; 因此把複數的關聯model轉成變數的形式, 並且 觀察 console.log, 使用.dataValue拿資料
        const userComments = user.Comments ? user.Comments : []

        return res.render('profile', {
          user: user.toJSON(),
          userComments
        })
      })
      .catch(err => next(err))
  },
  editUser: (req, res, next) => {
    return User.findByPk(req.params.id, { raw: true })
      .then(user => {
        if (!user) throw new Error('使用者不存在!')
        return res.render('edit-user', { user })
      })
      .catch(err => next(err))
  },
  putUser: (req, res, next) => {
    // 使用者只能編輯自己的資料: 比對傳入的id 與 passport的id
    if (Number(req.params.id) !== req.user.id) throw new Error('只能編輯自己的使用者資料!')
    const { name } = req.body
    if (!name.trim()) throw new Error('需要輸入使用者名稱!')
    const file = req.file // 拿取 middleware 傳過來的檔案
    return Promise.all([
      User.findByPk(req.params.id),
      localFileHandler(file) // 將圖案寫入指定資料夾, 並回傳圖檔路徑
    ])
      .then(([user, filePath]) => {
      // 檢查使用者是否存在
        if (!user) throw new Error('使用者不存在!')
        user.update({
          name,
          image: filePath || user.image
        })
      })
      .then(() => {
        req.flash('success_messages', '成功變更使用者資訊!')
        res.redirect(`/users/${req.params.id}`)
      })
      .catch(err => next(err))
  },
  addFavorite: (req, res, next) => {
    const userId = req.user.id
    const restaurantId = req.params.restaurantId
    return Promise.all([
      Restaurant.findByPk(restaurantId, {
        // 取出關聯 model, 更新收藏數
        include: [{ model: User, as: 'FavoritedUsers' }]
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
        Favorite.create({
          userId,
          restaurantId
        })
        return restaurant.update({
          // 新增收藏時, 追蹤數 + 1
          favoriteCounts: restaurant.FavoritedUsers.length + 1
        })
      })
      .then(() => res.redirect('back'))
      .catch(err => next(err))
  },
  removeFavorite: (req, res, next) => {
    const userId = req.user.id
    const restaurantId = req.params.restaurantId
    return Promise.all([
      Restaurant.findByPk(restaurantId, {
        // 取出關聯 model, 更新收藏數
        include: [{ model: User, as: 'FavoritedUsers' }]
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
        favorite.destroy()
        return restaurant.update({
          // 移除收藏時, 追蹤數 - 1
          favoriteCounts: restaurant.FavoritedUsers.length < 1 ? 0 : restaurant.FavoritedUsers.length - 1 // 防護機制
        })
      })
      .then(() => res.redirect('back'))
      .catch(err => next(err))
  },
  addLike: (req, res, next) => {
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
      .then(() => res.redirect('back'))
      .catch(err => next(err))
  },
  removeLike: (req, res, next) => {
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
      .then(() => res.redirect('back'))
      .catch(err => next(err))
  },
  getTopUsers: (req, res, next) => {
    return User.findAll({
      include: [{ model: User, as: 'Followers' }] // 取出追蹤此user的人
    })
      .then(users => {
        const result = users
          // 傳入的 map 函式記得用小括號包住
          .map(user => ({
            ...user.toJSON(), // 使用展開運算子倒入 map 函式傳入的 user 屬性
            followerCount: user.Followers.length, // 傳入的使用者與其追隨自己的數量
            isFollowed: req.user.Followings.some(f => f.id === user.id)
          // 判斷目前登入的使用者帳戶的追蹤者名單是否包含傳入的使用者
          }))
          // 利用.sort箭頭函式排序(a,b): 由大到小 b - a; 由小到大 a - b
          .sort((a, b) => b.followerCount - a.followerCount)
        return res.render('top-users', { users: result })
      })
      .catch(err => next(err))
  },
  addFollowing: (req, res, next) => {
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
        Followship.create({ followingId, followerId })
      })
      .then(() => res.redirect('back'))
      .catch(err => next(err))
  },
  removeFollowing: (req, res, next) => {
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
        followship.destroy()
      })
      .then(() => res.redirect('back'))
      .catch(err => next(err))
  }
}

module.exports = userController
