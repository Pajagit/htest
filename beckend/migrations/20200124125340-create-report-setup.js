"use strict";
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("reportsetups", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      browser_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: { model: "browsers", key: "id" }
      },
      environment_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: { model: "environments", key: "id" }
      },
      device_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: { model: "devices", key: "id" }
      },
      simulator_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: { model: "simulators", key: "id" }
      },
      operating_system_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: { model: "operatingsystems", key: "id" }
      },
      version_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: { model: "versions", key: "id" }
      },
      report_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: "reports", key: "id" }
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable("reportsetups");
  }
};
