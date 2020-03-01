"use strict";
const Sequelize = require("sequelize");
const pgURI = require("../config/keys").postgresURI;
const sequelize = new Sequelize(pgURI);

const ReportLink = sequelize.define(
  "reportlinks",
  {
    id: {
      type: Sequelize.INTEGER,
      required: true,
      primaryKey: true,
      autoIncrement: true
    },
    title: {
      required: false,
      type: Sequelize.STRING
    },
    value: {
      required: true,
      type: Sequelize.STRING
    },
    report_id: {
      required: false,
      type: Sequelize.INTEGER
    }
  },
  { timestamps: false }
);

module.exports = ReportLink;
