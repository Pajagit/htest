"use strict";
const Sequelize = require("sequelize");
const pgURI = require("../config/keys").postgresURI;
const sequelize = new Sequelize(pgURI);
const UserSettings = sequelize.define(
  "usersettings",
  {
    id: {
      type: Sequelize.INTEGER,
      required: true,
      primaryKey: true,
      autoIncrement: true
    },
    project_id: {
      required: false,
      type: Sequelize.INTEGER,
      references: {
        model: "projects",
        key: "id"
      }
    },
    user_id: {
      type: Sequelize.INTEGER,
      required: true,
      foreignKey: true,
      references: {
        model: "users",
        key: "id"
      }
    }
  },
  { timestamps: false }
);

module.exports = UserSettings;
