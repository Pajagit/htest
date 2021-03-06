"use strict";
const Sequelize = require("sequelize");
const pgURI = require("../config/keys").postgresURI;
const sequelize = new Sequelize(pgURI);
const Office = require("./office");
const Project = require("./project");
const ProjectDevice = require("./projectdevice");

const Device = sequelize.define(
  "devices",
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
    udid: {
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
    office_id: {
      type: Sequelize.INTEGER,
      foreignKey: true,
      references: {
        model: "offices",
        key: "id"
      },
      require: true
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

Device.belongsTo(Office, {
  foreignKey: "office_id",
  targetKey: "id"
});

Device.belongsToMany(Project, {
  through: ProjectDevice,
  foreignKey: "device_id",
  targetKey: "id",
  as: "projects"
});
Project.belongsToMany(Device, {
  through: ProjectDevice,
  foreignKey: "project_id",
  targetKey: "id",
  as: "devices"
});

module.exports = Device;
