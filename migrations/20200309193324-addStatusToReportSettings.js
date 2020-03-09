"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn("reportsettings", "statuses", {
      type: Sequelize.ARRAY(Sequelize.INTEGER),
      allowNull: true,
      defaultValue: []
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn("reportsettings", "statuses");
  }
};
