'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('grouptestcases', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      group_id: {
        allowNull:false,
        type: Sequelize.INTEGER,
        references: { model: 'groups', key: 'id' }

      },
      test_case_id: {
        allowNull:false,
        type: Sequelize.INTEGER,
        references: { model: 'testcases', key: 'id' }

      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('grouptestcases');
  }
};