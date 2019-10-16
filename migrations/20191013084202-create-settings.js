"use strict";
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("projectsettings", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      testcase_groups: {
        type: Sequelize.ARRAY(Sequelize.INTEGER),
        allowNull: true,
        defaultValue: []
      },
      testcase_users: {
        type: Sequelize.ARRAY(Sequelize.INTEGER),
        allowNull: true,
        defaultValue: []
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
      },
      project_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: { model: "projects", key: "id" }
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable("projectsettings");
  }
};
