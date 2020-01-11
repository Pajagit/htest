"use strict";
const Sequelize = require("sequelize");
const pgURI = require("../config/keys").postgresURI;
const sequelize = new Sequelize(pgURI);
const ProjectDevice = sequelize.define(
  "projectdevices",
  {
    id: {
      type: Sequelize.INTEGER,
      required: true,
      primaryKey: true,
      autoIncrement: true
    },
    project_id: {
      type: Sequelize.INTEGER,
      required: true,
      foreignKey: true,
      references: { model: "projects", key: "id" }
    },
    device_id: {
      type: Sequelize.INTEGER,
      required: true,
      foreignKey: true,
      references: { model: "devices", key: "id" }
    }
  },
  { timestamps: false }
);

module.exports = ProjectDevice;
