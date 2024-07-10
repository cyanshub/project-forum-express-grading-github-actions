// 載入 services 層
const commentServices = require('../../services/comment-services')

const commentController = {
  postComment: (req, res, next) => {
    return commentServices.postComment(req, (err, data) => {
      if (err) next(err)
      req.flash('success_messages', '成功新增訊息!')
      return res.redirect(`/restaurants/${data.comment.restaurantId}`)
    })
  },
  deleteComment: (req, res, next) => {
    return commentServices.deleteComment(req, (err, data) => {
      if (err) next(err)
      req.flash('success_messages', '成功刪除訊息!')
      return res.redirect(`/restaurants/${data.comment.restaurantId}`)
    })
  }
}

module.exports = commentController
