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
    testcase_show_filters: {
      required: true,
      type: Sequelize.BOOLEAN
    },
    testcase_view_mode: {
      required: true,
      type: Sequelize.INTEGER
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
