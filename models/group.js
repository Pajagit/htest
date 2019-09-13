"use strict";
const Sequelize = require("sequelize");
const pgURI = require("../config/keys").postgresURI;
const sequelize = new Sequelize(pgURI);
const Color = require("./color");

const Group = sequelize.define(
  "groups",
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
    pinned: {
      type: Sequelize.BOOLEAN,
      required: true
    },
    user_id: {
      type: Sequelize.INTEGER,
      required: true,
      foreignKey: true,
      references: {
        model: "users",
        key: "id"
      }
    },
    color_id: {
      type: Sequelize.INTEGER,
      required: true,
      foreignKey: true,
      references: {
        model: "colors",
        key: "id"
      }
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
      required: true
    },
    updated: {
      type: Sequelize.DATE,
      required: false
    }
  },
  { timestamps: false }
);

Group.belongsTo(Color, {
  foreignKey: "color_id",
  targetKey: "id",
  as: "color"
});

module.exports = Group;
