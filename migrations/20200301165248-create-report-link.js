"use strict";
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("reportlinks", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      report_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: "reports", key: "id" }
      },
      title: {
        type: Sequelize.STRING(150),
        allowNull: true
      },
      value: {
        type: Sequelize.STRING(150),
        allowNull: false
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable("reportlinks");
  }
};
