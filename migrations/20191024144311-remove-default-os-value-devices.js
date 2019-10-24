"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.changeColumn("devices", "operating_system_id", {
      type: Sequelize.INTEGER,
      defaultValue: null,
      allowNull: false
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.changeColumn("devices", "operating_system_id", {
      type: Sequelize.INTEGER,
      defaultValue: null,
      allowNull: false
    });
  }
};
