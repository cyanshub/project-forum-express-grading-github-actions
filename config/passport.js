// 載入所需套件
const passport = require('passport')
const LocalStrategy = require('passport-local')
const passportJWT = require('passport-jwt')
const JWTStrategy = passportJWT.Strategy
const ExtractJWT = passportJWT.ExtractJwt

const bcrypt = require('bcryptjs')

const { User } = require('../models')

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
passport.serializeUser((user, cb) => {
  cb(null, user.id)
})

// 反序列化
passport.deserializeUser((id, cb) => {
  // 為了在 main.hbs 的 header 帶出使用者資訊, 還是要查詢資料
  // 操作資料庫, 依存放在 passport 的 id 從資料庫取出物件
  User.findByPk(id, {
    attributes: { exclude: ['password'] }
  })
    .then(user => cb(null, user.toJSON())) // 整理 sequelize 打包後的物件
    .catch(err => cb(err))
})

// 設計 jwt 的登入策略的 options
const jwtOptions = {
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET
}

// 設置 jwt 登入策略
passport.use(new JWTStrategy(jwtOptions, (jwtPayload, cb) => {
  // 在同步語法捕捉可能的錯誤事件
  try {
    // cb vs promise, 統一成其中一種風格
    console.log('登入的user資料', jwtPayload)
    cb(null, jwtPayload)
  } catch (err) {
    cb(err)
  }
}))

module.exports = passport
