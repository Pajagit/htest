"use strict";
const Sequelize = require("sequelize");
const pgURI = require("../config/keys").postgresURI;
const sequelize = new Sequelize(pgURI);
const Office = require("./office");
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

Device.belongsTo(Office, {
  foreignKey: "office_id",
  targetKey: "id"
});

module.exports = Device;
