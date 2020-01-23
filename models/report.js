"use strict";
const Sequelize = require("sequelize");
const pgURI = require("../config/keys").postgresURI;
const sequelize = new Sequelize(pgURI);
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

module.exports = Report;
