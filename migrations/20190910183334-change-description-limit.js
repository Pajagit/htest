'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.changeColumn('testcases', 'description', {
      allowNull: true,
      type: Sequelize.STRING,
      defaultValue: null,
      type: Sequelize.STRING(1000)
    });
  },

  down: (queryInterface, Sequelize) => {}
};
