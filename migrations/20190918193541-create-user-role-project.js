"use strict";
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("userroleprojects", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      project_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: "projects", key: "id" }
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: "users", key: "id" }
      },
      role_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: "roles", key: "id" }
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable("userroleprojects");
  }
};
