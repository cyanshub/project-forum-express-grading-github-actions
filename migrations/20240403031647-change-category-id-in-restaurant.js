'use strict'
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('restaurants', 'category_id', {
      type: Sequelize.INTEGER,
      allowNull: true
    }, {
      references: {
        model: 'categories',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('restaurants', 'category_id', {
      type: Sequelize.INTEGER,
      allowNull: false
    }, {
      references: {
        model: 'categories',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT'
    })
  }
}
