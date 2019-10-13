"use strict";
const Sequelize = require("sequelize");
const pgURI = require("../config/keys").postgresURI;
const sequelize = new Sequelize(pgURI);
const Settings = sequelize.define(
  "settings",
  {
    id: {
      type: Sequelize.INTEGER,
      required: true,
      primaryKey: true,
      autoIncrement: true
    },
    testcase_groups: {
      required: false,
      type: Sequelize.ARRAY(Sequelize.INTEGER)
    },
    testcase_users: {
      required: false,
      type: Sequelize.ARRAY(Sequelize.INTEGER)
    },
    testcase_date_from: {
      required: false,
      type: Sequelize.DATE
    },
    testcase_date_to: {
      required: false,
      type: Sequelize.DATE
    },
    testcase_search_term: {
      required: false,
      type: Sequelize.STRING
    },
    testcase_view_mode: {
      required: true,
      type: Sequelize.INTEGER
    },
    testcase_show_filters: {
      required: true,
      type: Sequelize.BOOLEAN
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

module.exports = Settings;
