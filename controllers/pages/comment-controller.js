// 載入共用 Serivces 層
const commentServices = require('../../services/comment-services')

const commentController = {
  postComment: (req, res, next) => {
    commentServices.postComment(req, (err, data) => {
      if (err) return next(err)
      // req.flash('success_messages', '成功新增訊息!')
      req.session.newCommentData = data
      res.redirect(`/restaurants/${data.comment.restaurantId}`)
    })
  },
  deleteComment: (req, res, next) => {
    commentServices.deleteComment(req, (err, data) => {
      if (err) return next(err)
      req.flash('success_messages', '成功刪除訊息!')
      req.session.deletedCommentData = data
      res.redirect(`/restaurants/${data.comment.restaurantId}`)
    })
  }
}

module.exports = commentController
