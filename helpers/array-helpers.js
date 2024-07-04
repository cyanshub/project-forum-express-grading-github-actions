module.exports = {
  // 處理關鍵字查詢
  filterKeyword: (items, keyword) => {
    return items.filter(item =>
      item.name.toLowerCase().includes(keyword.toLowerCase()) ||
      item.fullAddress.toLowerCase().includes(keyword.toLowerCase()))
  },
  shuffleFisherYates: items => {
    // Fisher-Yates 洗牌演算法
    for (let i = items.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [items[i], items[j]] = [items[j], items[i]]
    }
    return items
  },
  filterUnique: (items, keyPath) => {
    // keyPath i.e. [key1, key2, ...] 代表物件的嵌套屬性路徑
    const seen = new Set() // 使用 Set 陣列來追蹤已經出現過的屬性
    return items.map(item => {
      const uniqueValue = getNestedValue(item, keyPath) // i.e item[key1][key2][...]
      return uniqueValue !== undefined && seen.has(uniqueValue) ? null : (seen.add(uniqueValue), item)
    }).filter(Boolean) // 過濾掉為 null 的值

    // 逐層深入物件的嵌套結構, 獲取嵌套屬性的值; obj是原物件
    // keys 是一個表示嵌套路徑的陣列，例如['picture', 'large']
    // reduce 從 obj 開始，依次取出 keys 中的每個鍵，逐層深入物件結構。
    function getNestedValue (obj, keys) {
      return keys.reduce((acc, key) => (acc && acc[key] !== undefined) ? acc[key] : undefined, obj)
    }
  }
}
