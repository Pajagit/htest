'use strict';
const { Pool } = require('pg');
const Sequelize = require('sequelize');
const pgURI = require('../config/keys').postgresURI;
const sequelize = new Sequelize(pgURI, {
  operatorsAliases: false
});
const TestStep = sequelize.define(
  'teststeps',
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
    expected_result: {
      type: Sequelize.STRING,
      required: false
    },
    test_case_id: {
      type: Sequelize.INTEGER,
      required: true,
      foreignKey: true,
      references: {
        model: 'testcases',
        key: 'id'
      }
    }
  },
  {}
);
TestStep.associate = function(models) {
  // associations can be defined here
};
module.exports = TestStep;
