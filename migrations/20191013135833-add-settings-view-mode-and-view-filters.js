"use strict";
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("usersettings", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      testcase_view_mode: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1
      },
      testcase_show_filters: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true
      },
      user_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: { model: "users", key: "id" }
      },
      project_id: {
        allowNull: true,
        type: Sequelize.INTEGER,
        references: { model: "projects", key: "id" }
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable("usersettings");
  }
};
