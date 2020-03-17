"use strict";
const Sequelize = require("sequelize");
const pgURI = require("../config/keys").postgresURI;
const sequelize = new Sequelize(pgURI);
const Status = require("./status");
const ReportSetup = require("./reportsetup");
const ReportStep = require("./reportstep");
const TestCase = require("./testcase");
const User = require("./user");
const ReportLink = require("./reportlink");

const Report = sequelize.define(
  "reports",
  {
    id: {
      require: true,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    test_case_id: {
      type: Sequelize.INTEGER,
      required: true,
      foreignKey: true,
      references: {
        model: "testcases",
        key: "id"
      }
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
    actual_result: {
      type: Sequelize.STRING,
      required: false
    },
    status_id: {
      type: Sequelize.INTEGER,
      required: true,
      foreignKey: true,
      references: {
        model: "statuses",
        key: "id"
      }
    },
    created_at: {
      type: Sequelize.DATE,
      required: true
    },
    comment: {
      type: Sequelize.STRING,
      required: false
    },
    additional_precondition: {
      type: Sequelize.STRING,
      required: false
    }
  },
  {
    timestamps: false
  }
);

Report.belongsTo(Status, {
  foreignKey: "status_id",
  targetKey: "id",
  as: "status"
});

Report.hasOne(ReportSetup, {
  foreignKey: "report_id",
  targetKey: "id",
  as: "reportsetup"
});

Report.hasMany(ReportStep, {
  foreignKey: "report_id",
  targetKey: "id",
  as: "steps"
});

ReportSetup.belongsTo(Report, {
  foreignKey: "report_id",
  targetKey: "id",
  as: "reports"
});

Report.hasMany(ReportLink, {
  foreignKey: "report_id",
  targetKey: "id",
  as: "links"
});

Report.belongsTo(TestCase, {
  foreignKey: "test_case_id",
  targetKey: "id",
  as: "testcase"
});

TestCase.hasMany(Report, {
  foreignKey: "test_case_id",
  targetKey: "id",
  as: "reports"
});

Report.belongsTo(User, {
  foreignKey: "user_id",
  targetKey: "id",
  as: "user"
});

User.hasMany(Report, {
  foreignKey: "user_id",
  targetKey: "id"
});

module.exports = Report;
