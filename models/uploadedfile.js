'use strict';
const { Pool } = require('pg');
const Sequelize = require('sequelize');
const pgURI = require('../config/keys').postgresURI;
const sequelize = new Sequelize(pgURI);
const UploadedFile = sequelize.define(
  'uploadedfiles',
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
    path: {
      type: Sequelize.STRING,
      required: true
    },
    test_case_id: {
      type: Sequelize.INTEGER,
      required: false,
      foreignKey: true,
      references: {
        model: 'testcases',
        key: 'id'
      }
    }
  },
  {}
);
UploadedFile.associate = function(models) {
  // associations can be defined here
};
module.exports = UploadedFile;
