"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("projectdevices", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      project_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: "projects", key: "id" }
      },
      device_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: "devices", key: "id" }
      }
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable("projectdevices");
  }
};
