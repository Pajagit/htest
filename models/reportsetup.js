"use strict";
const Sequelize = require("sequelize");
const pgURI = require("../config/keys").postgresURI;
const sequelize = new Sequelize(pgURI);
const Browser = require("./browser");
const Environment = require("./environment");
const Device = require("./device");
const Simulator = require("./simulator");
const Version = require("./version");
const OperatingSystem = require("./operatingsystem");

const ReportSetup = sequelize.define(
  "reportsetups",
  {
    id: {
      type: Sequelize.INTEGER,
      required: true,
      primaryKey: true,
      autoIncrement: true
    },
    browser_id: {
      required: false,
      type: Sequelize.INTEGER
    },
    environment_id: {
      required: false,
      type: Sequelize.INTEGER
    },
    device_id: {
      required: false,
      type: Sequelize.INTEGER
    },
    simulator_id: {
      required: false,
      type: Sequelize.INTEGER
    },
    operating_system_id: {
      required: false,
      type: Sequelize.INTEGER
    },
    version_id: {
      required: false,
      type: Sequelize.INTEGER
    },
    report_id: {
      required: false,
      type: Sequelize.INTEGER
    }
  },
  { timestamps: false }
);

ReportSetup.belongsTo(Browser, {
  foreignKey: "browser_id",
  targetKey: "id",
  as: "browser"
});

ReportSetup.belongsTo(Environment, {
  foreignKey: "environment_id",
  targetKey: "id",
  as: "environment"
});

ReportSetup.belongsTo(Device, {
  foreignKey: "device_id",
  targetKey: "id",
  as: "device"
});

ReportSetup.belongsTo(Simulator, {
  foreignKey: "simulator_id",
  targetKey: "id",
  as: "simulator"
});

ReportSetup.belongsTo(Version, {
  foreignKey: "version_id",
  targetKey: "id",
  as: "version"
});

Version.hasMany(ReportSetup, {
  foreignKey: "version_id",
  targetKey: "id",
  as: "reportsetups"
});

ReportSetup.belongsTo(OperatingSystem, {
  foreignKey: "operating_system_id",
  targetKey: "id",
  as: "operatingsystem"
});

module.exports = ReportSetup;
