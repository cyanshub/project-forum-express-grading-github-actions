const bcrypt = require('bcryptjs') // 載入 bcrypt
const db = require('../models')
const { User } = db

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
  }
}

module.exports = userController
