"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("projectsimulators", {
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
      simulator_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: "simulators", key: "id" }
      }
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable("projectsimulators");
  }
};
