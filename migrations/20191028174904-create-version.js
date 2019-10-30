"use strict";
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("versions", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      version: {
        type: Sequelize.STRING,
        allowNull: false
      },
      used: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true
      },
      deprecated: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      project_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: "projects", key: "id" }
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
    return queryInterface.dropTable("versions");
  }
};
