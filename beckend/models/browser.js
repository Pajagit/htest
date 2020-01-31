"use strict";
const Sequelize = require("sequelize");
const pgURI = require("../config/keys").postgresURI;
const sequelize = new Sequelize(pgURI);
const Browser = sequelize.define(
  "browsers",
  {
    id: {
      require: true,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    title: {
      type: Sequelize.STRING,
      require: true
    },
    screen_resolution: {
      type: Sequelize.STRING,
      require: false
    },
    version: {
      type: Sequelize.STRING,
      require: false
    },
    used: {
      require: true,
      type: Sequelize.BOOLEAN
    },
    project_id: {
      require: true,
      type: Sequelize.INTEGER
    },
    deprecated: {
      type: Sequelize.BOOLEAN,
      require: true
    },
    created_at: {
      require: true,
      type: Sequelize.DATE
    },
    updated_at: {
      require: false,
      type: Sequelize.DATE
    }
  },

  {
    timestamps: false
  }
);

module.exports = Browser;
