"use strict";
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("projects", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      title: {
        allowNull: false,
        type: Sequelize.STRING,
        unique: true
      },
      deleted: {
        allowNull: false,
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      deleted_date: {
        allowNull: true,
        type: Sequelize.DATE,
        defaultValue: null
      },
      description: {
        allowNull: true,
        type: Sequelize.STRING(1000),
        defaultValue: null
      },
      started_at: {
        allowNull: true,
        type: Sequelize.DATE,
        defaultValue: null
      },
      ended_at: {
        allowNull: true,
        type: Sequelize.DATE,
        defaultValue: null
      },
      image_url: {
        allowNull: true,
        type: Sequelize.STRING(1000),
        defaultValue: null
      },
      project_manager: {
        allowNull: true,
        type: Sequelize.STRING,
        defaultValue: null
      },
      jira_url: {
        allowNull: true,
        type: Sequelize.STRING,
        defaultValue: null
      },
      url: {
        allowNull: false,
        type: Sequelize.STRING
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("NOW")
      },
      updated_at: {
        allowNull: true,
        type: Sequelize.DATE,
        defaultValue: null
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable("projects");
  }
};
