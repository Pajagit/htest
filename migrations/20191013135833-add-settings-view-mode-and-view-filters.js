"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn("settings", "testcase_view_mode", {
      type: Sequelize.INTEGER,
      defaultValue: 1,
      allowNull: false
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn("settings", "testcase_view_mode");
  }
};
