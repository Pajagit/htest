'use strict';
const { Pool } = require('pg');
const Sequelize = require('sequelize');
const pgURI = require('../config/keys').postgresURI;
const sequelize = new Sequelize(pgURI, {
  operatorsAliases: false
});
const GroupTestCase = sequelize.define(
  'grouptestcases',
  {
    id: {
      type: Sequelize.INTEGER,
      required: true,
      primaryKey: true,
      autoIncrement: true
    },
    group_id: {
      type: Sequelize.INTEGER,
      required: true,
      foreignKey: true,
      references: {
        model: 'groups',
        key: 'id'
      }
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
  {timestamps: false}
);
GroupTestCase.associate = function(models) {
  // associations can be defined here
};
module.exports = GroupTestCase;
