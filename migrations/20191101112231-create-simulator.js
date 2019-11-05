"use strict";
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("simulators", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false
      },
      resolution: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: null
      },
      dpi: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: null
      },
      screen_size: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: null
      },
      os: {
        type: Sequelize.STRING,
        allowNull: true
      },
      retina: {
        type: Sequelize.BOOLEAN,
        allowNull: false
      },
      deprecated: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
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
      },
      emulator: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable("simulators");
  }
};
