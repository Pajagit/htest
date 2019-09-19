"use strict";
const Sequelize = require("sequelize");
const pgURI = require("../config/keys").postgresURI;
const sequelize = new Sequelize(pgURI);
const Project = require("./project");
const UserRoleProject = require("./userroleproject");

const User = sequelize.define(
  "users",
  {
    id: {
      type: Sequelize.INTEGER,
      required: true,
      primaryKey: true,
      autoIncrement: true
    },
    first_name: {
      type: Sequelize.STRING,
      required: false
    },
    email: {
      type: Sequelize.STRING,
      required: true
    },
    last_name: {
      type: Sequelize.STRING,
      required: false
    },
    position: {
      type: Sequelize.STRING,
      required: false
    },
    active: {
      type: Sequelize.BOOLEAN,
      required: true
    },
    image_url: {
      type: Sequelize.STRING,
      required: false
    },
    created_at: {
      type: Sequelize.DATE,
      required: true
    },
    updated_at: {
      type: Sequelize.DATE,
      required: false
    }
  },
  { timestamps: false }
);
User.belongsToMany(Project, {
  through: UserRoleProject,
  foreignKey: "user_id",
  targetKey: "id",
  as: "projects"
});
Project.belongsToMany(User, {
  through: UserRoleProject,
  foreignKey: "project_id",
  targetKey: "id",
  as: "users"
});

module.exports = User;
