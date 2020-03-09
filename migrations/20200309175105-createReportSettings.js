"use strict";
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("reportsettings", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      groups: {
        type: Sequelize.ARRAY(Sequelize.INTEGER),
        allowNull: true,
        defaultValue: []
      },
      users: {
        type: Sequelize.ARRAY(Sequelize.INTEGER),
        allowNull: true,
        defaultValue: []
      },
      devices: {
        type: Sequelize.ARRAY(Sequelize.INTEGER),
        allowNull: true,
        defaultValue: []
      },
      browsers: {
        type: Sequelize.ARRAY(Sequelize.INTEGER),
        allowNull: true,
        defaultValue: []
      },
      versions: {
        type: Sequelize.ARRAY(Sequelize.INTEGER),
        allowNull: true,
        defaultValue: []
      },
      simulators: {
        type: Sequelize.ARRAY(Sequelize.INTEGER),
        allowNull: true,
        defaultValue: []
      },
      operatingsystems: {
        type: Sequelize.ARRAY(Sequelize.INTEGER),
        allowNull: true,
        defaultValue: []
      },
      environments: {
        type: Sequelize.ARRAY(Sequelize.INTEGER),
        allowNull: true,
        defaultValue: []
      },
      date_from: {
        type: Sequelize.DATE,
        allowNull: true
      },
      date_to: {
        type: Sequelize.DATE,
        allowNull: true
      },
      view_mode: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1
      },
      show_filters: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true
      },
      search_term: {
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
    return queryInterface.dropTable("reportsettings");
  }
};
