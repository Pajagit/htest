"use strict";
const Sequelize = require("sequelize");
const pgURI = require("../config/keys").postgresURI;
const sequelize = new Sequelize(pgURI);
const UserRoleProject = sequelize.define(
  "userroleprojects",
  {
    id: {
      type: Sequelize.INTEGER,
      required: true,
      primaryKey: true,
      autoIncrement: true
    },
    project_id: {
      type: Sequelize.INTEGER,
      required: true,
      foreignKey: true,
      references: { model: "projects", key: "id" }
    },
    user_id: {
      type: Sequelize.INTEGER,
      required: true,
      foreignKey: true,
      references: { model: "users", key: "id" }
    },
    role_id: {
      type: Sequelize.INTEGER,
      required: true,
      foreignKey: true,
      references: { model: "roles", key: "id" }
    }
  },
  { timestamps: false }
);

module.exports = UserRoleProject;
