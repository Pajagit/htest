"use strict";
const Sequelize = require("sequelize");
const pgURI = require("../config/keys").postgresURI;
const sequelize = new Sequelize(pgURI);
const Project = require("./project");
const ProjectTestSetupItem = require("./projecttestsetupitem");

const TestSetupItem = sequelize.define(
  "testsetupitems",
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
    }
  },
  { timestamps: false }
);
Project.belongsToMany(TestSetupItem, {
  through: ProjectTestSetupItem,
  foreignKey: "project_id",
  targetKey: "id",
  as: "testsetupitems"
});
TestSetupItem.belongsToMany(Project, {
  through: ProjectTestSetupItem,
  foreignKey: "testsetupitem_id",
  targetKey: "id",
  as: "projects"
});

module.exports = TestSetupItem;
