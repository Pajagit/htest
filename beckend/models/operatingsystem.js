"use strict";
const Sequelize = require("sequelize");
const pgURI = require("../config/keys").postgresURI;
const sequelize = new Sequelize(pgURI);
const OperatingSystem = sequelize.define(
  "operatingsystems",
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
    }
  },
  { timestamps: false }
);

module.exports = OperatingSystem;
