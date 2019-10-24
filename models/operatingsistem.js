"use strict";
const Sequelize = require("sequelize");
const pgURI = require("../config/keys").postgresURI;
const sequelize = new Sequelize(pgURI);
const OperatingSystem = sequelize.define(
  "operatingsystems",
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
    version: {
      type: Sequelize.STRING,
      require: false
    }
  },
  {
    timestamps: false
  }
);

module.exports = OperatingSystem;
