const express = require('express')
const handlebars = require('express-handlebars')
const routes = require('./routes')

const app = express()
const port = process.env.PORT || 3000

app.engine('hbs', handlebars({ extname: '.hbs' })) // 註冊 handlebars 樣板引擎, 並指定副檔名為 .hbs
app.set('view engine', 'hbs') // 設定使用 handlebars 作為樣板引擎

app.use(express.urlencoded({ extended: true }))

app.use(routes)

app.listen(port, () => {
  console.info(`Example app listening on port: http://localhost:${port}`)
})

module.exports = app
