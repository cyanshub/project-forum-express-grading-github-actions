// 給定預設參數: limit每頁顯示10筆資料; page從第1頁開始
const getOffset = (limit = 10, page = 1) => (page - 1) * limit

// 給定預設參數, 假設limit每頁顯示10筆資料; 假設page從第1頁開始; 假設total有50筆資料
const getPagination = (limit = 10, page = 1, total = 50) => {
  const totalPage = Math.ceil(total / limit)

  const pages = Array.from({ length: totalPage }, (_, index) => index + 1)
  // 在Array.from的第一個參數參數傳入array或arrylike的物件;
  // 第二個參數則是map函式, 函式第一個參數沒有傳內容所以空白, 第二個參數則是index, 希望return index + 1

  const currentPage = page < 1 ? 1 : page < totalPage ? page : totalPage
  //  判斷 page 如果< 1 則停留在第1頁
  // 判斷目前頁如果 < totalPage, 則仍可維持目前頁; 否則取用 totalPage

  const prev = currentPage - 1 < 1 ? 1 : currentPage - 1
  // 判斷 currentPage - 1 如果比1小, 則為在第1頁

  const next = currentPage + 1 > totalPage ? totalPage : currentPage + 1
  // 判斷 currentPage + 1 如果比totalPage大, 則為在第末頁

  return {
    // 觀察 pagination 樣板設計參數
    pages,
    totalPage,
    currentPage,
    next,
    prev
  }
}

module.exports = {
  getOffset,
  getPagination
}
