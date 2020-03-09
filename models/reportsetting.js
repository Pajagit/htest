"use strict";
const Sequelize = require("sequelize");
const pgURI = require("../config/keys").postgresURI;
const sequelize = new Sequelize(pgURI);
const ReportSettings = sequelize.define(
  "reportsettings",
  {
    id: {
      type: Sequelize.INTEGER,
      required: true,
      primaryKey: true,
      autoIncrement: true
    },
    groups: {
      required: false,
      type: Sequelize.ARRAY(Sequelize.INTEGER)
    },
    users: {
      required: false,
      type: Sequelize.ARRAY(Sequelize.INTEGER)
    },
    devices: {
      required: false,
      type: Sequelize.ARRAY(Sequelize.INTEGER)
    },
    simulators: {
      required: false,
      type: Sequelize.ARRAY(Sequelize.INTEGER)
    },
    operatingsystems: {
      required: false,
      type: Sequelize.ARRAY(Sequelize.INTEGER)
    },
    browsers: {
      required: false,
      type: Sequelize.ARRAY(Sequelize.INTEGER)
    },
    versions: {
      required: false,
      type: Sequelize.ARRAY(Sequelize.INTEGER)
    },
    environments: {
      required: false,
      type: Sequelize.ARRAY(Sequelize.INTEGER)
    },
    date_from: {
      required: false,
      type: Sequelize.DATE
    },
    date_to: {
      required: false,
      type: Sequelize.DATE
    },
    search_term: {
      required: false,
      type: Sequelize.STRING
    },
    show_filters: {
      required: true,
      type: Sequelize.BOOLEAN
    },
    view_mode: {
      required: true,
      type: Sequelize.INTEGER
    },
    project_id: {
      required: true,
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

module.exports = ReportSettings;
