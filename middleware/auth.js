const { ensureAuthenticated, getUser } = require('../helpers/auth-helpers')

const authenticated = (req, res, next) => {
  if (ensureAuthenticated(req)) {
    return next()
  } else {
    res.redirect('/signin')
  }
}

const authenticatedAdmin = (req, res, next) => {
  if (ensureAuthenticated(req)) {
    if (getUser(req).isAdmin) {
      return next()
    } else {
      res.redirect('/')
    }
  } else {
    res.redirect('/signin')
  }
}

module.exports = {
  authenticated,
  authenticatedAdmin
}
