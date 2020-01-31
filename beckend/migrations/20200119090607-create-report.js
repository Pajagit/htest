"use strict";
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("reports", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      test_case_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: "testcases", key: "id" }
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: "users", key: "id" }
      },
      actual_result: {
        type: Sequelize.STRING(1000),
        allowNull: true
      },
      status_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: "statuses", key: "id" }
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("NOW")
      },
      comment: {
        type: Sequelize.STRING(1000),
        allowNull: true
      },
      additional_precondition: {
        type: Sequelize.STRING(1000),
        allowNull: true
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable("reports");
  }
};
