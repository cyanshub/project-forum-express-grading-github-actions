// 載入需要操作的資料表 Model
const { Comment, Restaurant, User } = require('../models')

const commentController = {
  postComment: (req, res, next) => {
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
      .then(() => {
        // req.flash('success_messages', '成功新增評論!')
        return res.redirect(`/restaurants/${restaurantId}`)
      })
      .catch(err => next(err))
  },
  deleteComment: (req, res, next) => {
    const commentId = req.params.id
    const userId = req.user.id
    return Promise.all([
      Comment.findByPk(commentId, { include: [User] }), // 拿出關聯 model
      User.findByPk(userId)
    ])
      .then(([comment, user]) => {
        if (!comment) throw new Error('該則訊息不存在!')

        // 如果被刪的訊息不是自己的則擋掉, 管理員例外
        if (user.isAdmin !== true && user.email !== comment.User.email) {
          req.flash('error_messages', '禁止刪除root使用者的評論!')
          return res.redirect('back')
        }

        return comment.destroy()
      })
      .then(deletedComment => {
        req.flash('success_messages', '成功刪除訊息!')
        return res.redirect(`/restaurants/${deletedComment.restaurantId}`)
      })
      .catch(err => next(err))
  }
}

module.exports = commentController
