'use strict';
const { Pool } = require('pg');
const Sequelize = require('sequelize');
const pgURI = require('../config/keys').postgresURI;
const sequelize = new Sequelize(pgURI);
const Link = sequelize.define(
  'links',
  {
    id: {
      type: Sequelize.INTEGER,
      required: true,
      primaryKey: true,
      autoIncrement: true
    },
    value: {
      type: Sequelize.STRING,
      required: true
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
Link.associate = function(models) {
  // associations can be defined here
};
module.exports = Link;
