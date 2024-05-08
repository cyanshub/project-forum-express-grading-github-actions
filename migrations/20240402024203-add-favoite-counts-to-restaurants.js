'use strict'
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Restaurants', 'favorite_counts', {
      type: Sequelize.INTEGER
    })
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Restaurants', 'favorite_counts')
  }
}
