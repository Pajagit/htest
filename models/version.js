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
    is_supported: {
      type: Sequelize.BOOLEAN,
      required: true
    },
    deleted: {
      type: Sequelize.BOOLEAN,
      required: false
    },
    support_stopped_at: {
      type: Sequelize.DATE,
      required: false
    },
    project_id: {
      type: Sequelize.INTEGER,
      required: true,
      foreignKey: true,
      references: {
        model: "projects",
        key: "id"
      }
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
