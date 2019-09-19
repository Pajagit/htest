"use strict";
const Sequelize = require("sequelize");
const pgURI = require("../config/keys").postgresURI;
const sequelize = new Sequelize(pgURI);
const Project = sequelize.define(
  "projects",
  {
    id: {
      type: Sequelize.INTEGER,
      required: true,
      primaryKey: true,
      autoIncrement: true
    },
    title: {
      required: true,
      type: Sequelize.STRING,
      unique: true
    },
    deleted: {
      required: true,
      type: Sequelize.BOOLEAN
    },
    deleted_date: {
      required: false,
      type: Sequelize.DATE
    },
    description: {
      required: false,
      type: Sequelize.STRING
    },
    started_at: {
      required: false,
      type: Sequelize.DATE
    },
    ended_at: {
      required: false,
      type: Sequelize.DATE
    },
    image_url: {
      required: false,
      type: Sequelize.STRING
    },
    project_manager: {
      required: false,
      type: Sequelize.STRING
    },
    jira_url: {
      required: false,
      type: Sequelize.STRING
    },
    url: {
      required: true,
      type: Sequelize.STRING
    },
    created_at: {
      required: true,
      type: Sequelize.DATE
    },
    updated_at: {
      required: false,
      type: Sequelize.DATE
    }
  },
  { timestamps: false }
);

module.exports = Project;
