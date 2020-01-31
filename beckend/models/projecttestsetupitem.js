"use strict";
const Sequelize = require("sequelize");
const pgURI = require("../config/keys").postgresURI;
const sequelize = new Sequelize(pgURI);
const ProjectTestSetupItem = sequelize.define(
  "projecttestsetupitems",
  {
    id: {
      type: Sequelize.INTEGER,
      required: true,
      primaryKey: true,
      autoIncrement: true
    },
    project_id: {
      type: Sequelize.INTEGER,
      required: true
    },
    testsetupitem_id: {
      type: Sequelize.INTEGER,
      required: true
    }
  },
  { timestamps: false }
);

module.exports = ProjectTestSetupItem;
