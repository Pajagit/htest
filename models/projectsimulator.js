"use strict";
const Sequelize = require("sequelize");
const pgURI = require("../config/keys").postgresURI;
const sequelize = new Sequelize(pgURI);
const ProjectSimulator = sequelize.define(
  "projectsimulators",
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
    simulator_id: {
      type: Sequelize.INTEGER,
      required: true,
      foreignKey: true,
      references: { model: "simulators", key: "id" }
    }
  },
  { timestamps: false }
);

module.exports = ProjectSimulator;
