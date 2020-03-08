"use strict";
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("reportsteps", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      step: {
        type: Sequelize.STRING(150),
        allowNull: false
      },
      input_data: {
        type: Sequelize.STRING(150),
        allowNull: true
      },
      report_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: "reports", key: "id" }
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable("reportsteps");
  }
};
