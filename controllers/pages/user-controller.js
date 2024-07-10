// 載入 Services
const userServices = require('../../services/user-services')

const userController = {
  signUpPage: (req, res, next) => {
    res.render('users/signup')
  },
  signUp: (req, res, next) => {
    return userServices.signUp(req, (err, data) => {
      if (err) next(err)
      req.flash('success_messages', '成功註冊帳號!')
      return res.redirect('/signin')
    })
  },
  signInPage: (req, res, next) => {
    res.render('users/signin')
  },
  signIn: (req, res, next) => {
    req.flash('success_messages', '登入成功!')
    res.redirect('/restaurants')
  },
  logout: (req, res, next) => {
    req.flash('success_messages', '登出成功!')
    req.logout()
    res.redirect('/signin')
  },
  getUser: (req, res, next) => {
    return userServices.getUser(req, (err, data) => {
      if (err) next(err)
      return res.render('users/profile', data)
    })
  },
  editUser: (req, res, next) => {
    return userServices.editUser(req, (err, data) => {
      if (err) next(err)
      return res.render('users/edit', data)
    })
  },
  putUser: (req, res, next) => {
    return userServices.putUser(req, (err, data) => {
      if (err) next(err)
      return res.redirect(`/users/${data.user.id}`)
    })
  },
  addFavorite: (req, res, next) => {
    return userServices.addFavorite(req, (err, data) => {
      if (err) next(err)
      return res.redirect('back')
    })
  },
  removeFavorite: (req, res, next) => {
    return userServices.removeFavorite(req, (err, data) => {
      if (err) next(err)
      return res.redirect('back')
    })
  },
  addLike: (req, res, next) => {
    return userServices.addLike(req, (err, data) => {
      if (err) next(err)
      return res.redirect('back')
    })
  },
  removeLike: (req, res, next) => {
    return userServices.removeLike(req, (err, data) => {
      if (err) next(err)
      return res.redirect('back')
    })
  },
  addFollowing: (req, res, next) => {
    return userServices.addFollowing(req, (err, data) => {
      if (err) next(err)
      return res.redirect('back')
    })
  },
  removeFollowing: (req, res, next) => {
    return userServices.removeFollowing(req, (err, data) => {
      if (err) next(err)
      return res.redirect('back')
    })
  },
  getTopUsers: (req, res, next) => {
    return userServices.getTopUsers(req, (err, data) => {
      if (err) next(err)
      return res.render('users/top-users', data)
    })
  }
}

module.exports = userController
