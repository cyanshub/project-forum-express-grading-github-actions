'use strict'
const faker = require('faker')
module.exports = {
  up: async (queryInterface, Sequelize) => {
    // 取出要關聯的 users 資料表的 users.id
    const users = await queryInterface.sequelize.query('SELECT `id` FROM `users`;', {
      type: queryInterface.sequelize.QueryTypes.SELECT
    })

    // 取出要關聯的 restaurants 資料表的 restaurants.id
    const restaurants = await queryInterface.sequelize.query('SELECT `id` FROM `restaurants`;', {
      type: queryInterface.sequelize.QueryTypes.SELECT
    })

    // 產生 comments 種子資料
    await queryInterface.bulkInsert('comments',
      Array.from({ length: 50 }, () => ({
        text: faker.lorem.sentence(),
        user_id: users[Math.floor(Math.random() * users.length)].id,
        restaurant_id: restaurants[Math.floor(Math.random() * restaurants.length)].id,
        created_at: new Date(),
        updated_at: new Date()
      }))
    )
  },
  down: async (queryInterface, Sequelize) => {
    queryInterface.bulkDelete('comments', null)
  }
}
