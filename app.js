const path = require('path')

const express = require('express')
const handlebars = require('express-handlebars')
const methodOverride = require('method-override')
const flash = require('connect-flash')
const session = require('express-session')
const passport = require('./config/passport')

const handlebarsHelpers = require('./helpers/handlebars-helpers')
const { getUser } = require('./helpers/auth-helpers')

const { pages, apis } = require('./routes')

const app = express()
const port = process.env.PORT || 3000
const SESSION_SECRET = 'secret'

// 註冊 handlebars 樣板引擎, 並指定副檔名為 .hbs
app.engine('hbs', handlebars({ extname: '.hbs', helpers: handlebarsHelpers }))
// 設定使用 handlebars 作為樣板引擎
app.set('view engine', 'hbs')

app.use(methodOverride('_method')) // 使用 method-override
app.use('/upload', express.static(path.join(__dirname, 'upload')))

app.use(express.urlencoded({ extended: true }))
app.use(session({ secret: SESSION_SECRET, resave: false, saveUninitialized: false }))
app.use(flash())

app.use(passport.initialize()) // 初始化 passport
app.use(passport.session())// 啟動 passport 的 session 功能 (必須放在加入 session() 之後)

// 參數沒有特別指定路徑, 代表所有路由都會進入這個 middleware
app.use((req, res, next) => {
  res.locals.success_messages = req.flash('success_messages') // 設定 success_msg 訊息
  res.locals.error_messages = req.flash('error_messages') // 設定 error_msg 訊息
  res.locals.user = getUser(req) // 調用 passport 的 req.user
  next()
})

app.use('/api', apis)
app.use(pages)

app.listen(port, () => {
  console.info(`Example app listening on port: http://localhost:${port}`)
})

module.exports = app
