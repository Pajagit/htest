"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn("settings", "project_id", {
      type: Sequelize.INTEGER,
      references: { model: "projects", key: "id" },
      defaultValue: null,
      allowNull: false
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn("settings", "project_id");
  }
};
