const dayjs = require('dayjs')

module.exports = {
  currentYear: () => dayjs().year(),
  ifCond: function (a, b, options) {
    return a === b ? options.fn(this) : options.inverse(this)
  } // 小心若用成箭頭函式會導致 this 被綁定在外層, 導致意料外的錯誤
}
