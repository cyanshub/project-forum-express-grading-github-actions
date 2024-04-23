// 載入所需工具
const jwt = require('jsonwebtoken')

const userController = {
  signIn: (req, res, next) => {
    // 利用 try catch 處理不是非同步語法的錯誤事件
    try {
      // 因為關閉了session功能, 因此要自己整理 user 的 sequelize 打包物件
      const userData = req.user.toJSON()

      // 不應該拿 user 的 password, 可使用 delete 方法把敏感資料拿掉
      delete userData.password

      // 利用 jwt 來發 token
      const token = jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: '30d' })
      res.json({
        status: 'success',
        data: {
          token,
          user: userData
        }
      })
    } catch (err) {
      next(err)
    }
  }
}

module.exports = userController
