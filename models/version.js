"use strict";
const Sequelize = require("sequelize");
const pgURI = require("../config/keys").postgresURI;
const sequelize = new Sequelize(pgURI);

const Version = sequelize.define(
  "versions",
  {
    version: {
      type: Sequelize.STRING,
      required: true
    },
    is_suported: {
      type: Sequelize.BOOLEAN,
      required: true
    },
    support_stopped_at: {
      type: Sequelize.DATE,
      required: false
    },
    created_at: {
      type: Sequelize.DATE,
      required: false
    },
    updated_at: {
      type: Sequelize.DATE,
      required: false
    }
  },
  { timestamps: false }
);

module.exports = Version;
