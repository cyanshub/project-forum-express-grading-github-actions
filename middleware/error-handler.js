module.exports = {
  generalErrorHandler (err, req, res, next) {
    // 判斷傳進來的參數(err), 是否為一個 error 物件
    if (err instanceof Error) {
      // 如果是 error 物件, 則必須攜帶 name 與 message 屬性
      req.flash('error_messages', `${err.name}:${err.message}`)
    } else {
      req.flash('error_message', `${err}`)
    }
    res.redirect('back')
    next(err)
  }
}
