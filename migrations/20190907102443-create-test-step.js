'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('teststeps', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      title: {
        allowNull: false,
        type: Sequelize.STRING
      },
      test_case_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: { model: 'testcases', key: 'id' }
      },
      expected_result: {
        allowNull: true,
        type: Sequelize.STRING,
        defaultValue: null
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('teststeps');
  }
};
