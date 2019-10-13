"use strict";
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("settings", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      testcase_groups: {
        type: Sequelize.ARRAY(Sequelize.INTEGER),
        allowNull: true
      },
      testcase_users: {
        type: Sequelize.ARRAY(Sequelize.INTEGER),
        allowNull: true
      },
      testcase_date_from: {
        type: Sequelize.DATE,
        allowNull: true
      },
      testcase_date_to: {
        type: Sequelize.DATE,
        allowNull: true
      },
      testcase_search_term: {
        type: Sequelize.STRING,
        allowNull: true
      },
      user_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: { model: "users", key: "id" }
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable("settings");
  }
};
