"use strict";
const Sequelize = require("sequelize");
const pgURI = require("../config/keys").postgresURI;
const sequelize = new Sequelize(pgURI);

const Color = sequelize.define(
  "colors",
  {
    id: {
      type: Sequelize.INTEGER,
      required: true,
      primaryKey: true,
      autoIncrement: true
    },
    code: {
      type: Sequelize.STRING,
      required: true
    },
    title: {
      type: Sequelize.STRING,
      required: true
    }
  },
  { timestamps: false }
);

module.exports = Color;
