"use strict";
const Sequelize = require("sequelize");
const pgURI = require("../config/keys").postgresURI;
const sequelize = new Sequelize(pgURI);
const Simulator = sequelize.define(
  "simulators",
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
    resolution: {
      type: Sequelize.STRING,
      require: false
    },
    dpi: {
      type: Sequelize.STRING,
      require: false
    },
    screen_size: {
      type: Sequelize.STRING,
      require: false
    },
    os: {
      type: Sequelize.STRING,
      require: true
    },
    retina: {
      type: Sequelize.BOOLEAN,
      require: false
    },
    emulator: {
      type: Sequelize.BOOLEAN,
      require: false
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

module.exports = Simulator;
