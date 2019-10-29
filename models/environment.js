"use strict";
const Sequelize = require("sequelize");
const pgURI = require("../config/keys").postgresURI;
const sequelize = new Sequelize(pgURI);

const Environment = sequelize.define(
  "environments",
  {
    id: {
      type: Sequelize.INTEGER,
      required: true,
      primaryKey: true,
      autoIncrement: true
    },
    title: {
      type: Sequelize.STRING,
      required: true
    },
    deprecated: {
      type: Sequelize.BOOLEAN,
      required: false,
      defaultValue: false
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
    used: {
      type: Sequelize.BOOLEAN
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

module.exports = Environment;
