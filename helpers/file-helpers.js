const fs = require('fs') // fs 是 Node.js 原生負責處理檔案的功能

const localFileHandler = file => { // file 是 multer 處理完的檔案
  // 建立非同步語的語法的物件實例
  return new Promise((resolve, reject) => {
    // 檢查傳入的檔案是否存在
    if (!file) return resolve(null) // 若不存在, 則停止函式運作
    // 準備將傳入的檔案, 寫入 upload 資料夾
    const fileName = `upload/${file.originalname}`
    // 將 fs 工具以非同步語法進行操作
    return fs.promises.readFile(file.path)
      .then(data => fs.promises.writeFile(fileName, data))
      .then(() => resolve(`/${fileName}`))
      .catch(err => reject(err))
  })
}

module.exports = { localFileHandler }
