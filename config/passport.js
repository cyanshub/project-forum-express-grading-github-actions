// 載入所需套件
const passport = require('passport')
const LocalStrategy = require('passport-local')
const bcrypt = require('bcryptjs')
const { User, Restaurant } = require('../models')

// 設置本地的登入策略 Set up passport strategy
passport.use(new LocalStrategy({
  // 加入客製化參數 customize user field
  usernameField: 'email', // 預設是 username
  passwordField: 'password',
  passReqToCallback: true // 要求把 req 傳給 callback
},
// 驗證使用者 Authenticate user
(req, email, password, done) => {
  User.findOne({ where: { email } })
    .then(user => {
    // 先驗證帳號是否輸入正確: 若否則回傳 done(null, false, ...)
      if (!user) { return done(null, false, req.flash('error_messages', '帳號或密碼輸入錯誤')) }

      // 驗證密碼是否正確輸入: 若否則回傳 done(null, false, ...)
      return bcrypt.compare(password, user.password).then(res => {
        if (!res) { return done(null, false, req.flash('error_messages', '帳號或密碼輸入錯數')) }
        // 當帳號存在, 且密碼一致才可回傳登入成功
        return done(null, user)
      })
    })
}
))

// 序列化與反序列化: 透過 passport 只把物件 id 存在session, 需要時再核對 id 取出整個物件的方法
// 序列化
passport.serializeUser((user, done) => {
  done(null, user.id)
})

// 反序列化
passport.deserializeUser((id, done) => {
  // 操作資料庫, 依存放在 passport 的 id 從資料庫取出物件
  User.findByPk(id, {
    include: [
      { model: Restaurant, as: 'FavoritedRestaurants' } // 關聯 User Model 的多對多關係 Model, 並寫上多對多關係的名稱(對應model設定的名稱)
    ]
  })
    .then(user => done(null, user.toJSON())) // 整理 sequelize 打包後的物件
    .catch(err => done(err))
})

module.exports = passport
