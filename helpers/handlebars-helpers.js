const dayjs = require('dayjs')
const relativeTive = require('dayjs/plugin/relativeTime') // 取得 dayjs 延伸的擴充功能
dayjs.extend(relativeTive) // 加入擴充功能

module.exports = {
  currentYear: () => dayjs().year(),
  relativeTimeFromNow: a => dayjs(a).fromNow(),
  ifCond: function (a, b, options) {
    return a === b ? options.fn(this) : options.inverse(this)
  } // 小心若用成箭頭函式會導致 this 被綁定在外層, 導致意料外的錯誤
}
