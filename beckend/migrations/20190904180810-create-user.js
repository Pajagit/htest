"use strict";
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("users", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      first_name: {
        allowNull: true,
        type: Sequelize.STRING,
        defaultValue: null
      },
      last_name: {
        allowNull: true,
        type: Sequelize.STRING,
        defaultValue: null
      },
      email: {
        allowNull: false,
        type: Sequelize.STRING,
        unique: true
      },
      position: {
        allowNull: true,
        type: Sequelize.STRING,
        defaultValue: null
      },
      active: {
        allowNull: false,
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      image_url: {
        allowNull: true,
        type: Sequelize.STRING,
        defaultValue: null
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
      last_login: {
        allowNull: true,
        type: Sequelize.DATE,
        defaultValue: null
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable("users");
  }
};
