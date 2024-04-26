// 載入需要操作的資料表 Model
const { Comment, Restaurant, User } = require('../models')

const commentServices = {
  postComment: (req, cb) => {
    const { text, restaurantId } = req.body
    const userId = req.user.id
    // 檢查評論是否存在
    if (!text) throw new Error('Comment text is required!')
    return Promise.all([
      User.findByPk(userId),
      Restaurant.findByPk(restaurantId)
    ])
      .then(([user, restaurant]) => {
        if (!user) throw new Error('下評論的使用者不存在!')
        if (!restaurant) throw new Error('被評論的餐廳不存在')
        return Comment.create({
          text,
          userId,
          restaurantId
        })
      })
      .then(newComment => {
        return cb(null, { comment: newComment })
      })
      .catch(err => cb(err))
  },
  deleteComment: (req, cb) => {
    const commentId = req.params.id
    const userId = req.user.id
    return Promise.all([
      // 拿出關聯 model, 避免使用者密碼外洩
      Comment.findByPk(commentId, {
        include: [
          { model: User, attributes: { exclude: ['password'] } }
        ]
      }),
      User.findByPk(userId)
    ])
      .then(([comment, user]) => {
        if (!comment) throw new Error('該則訊息不存在!')

        // 如果被刪的訊息不是自己的則擋掉, 管理員例外
        if (user.isAdmin !== true && user.email !== comment.User.email) {
          const err = new Error('禁止刪除root使用者的評論!')
          err.status = 404
          throw err
        }
        return comment.destroy()
      })
      .then(deletedComment => cb(null, { comment: deletedComment })
      )
      .catch(err => cb(err))
  }
}

module.exports = commentServices
