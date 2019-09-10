'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('offices', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      city: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      }
    },
      { timestamps: false }
    );
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('offices');
  }
};