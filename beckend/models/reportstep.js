"use strict";
const Sequelize = require("sequelize");
const pgURI = require("../config/keys").postgresURI;
const sequelize = new Sequelize(pgURI);

const ReportStep = sequelize.define(
  "reportsteps",
  {
    id: {
      type: Sequelize.INTEGER,
      required: true,
      primaryKey: true,
      autoIncrement: true
    },
    report_id: {
      required: true,
      type: Sequelize.INTEGER
    },
    step: {
      required: true,
      type: Sequelize.INTEGER
    },
    input_data: {
      required: false,
      type: Sequelize.INTEGER
    }
  },
  { timestamps: false }
);

module.exports = ReportStep;
