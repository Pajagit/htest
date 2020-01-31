'use strict';
const Sequelize = require('sequelize');
const pgURI = require('../config/keys').postgresURI;
const sequelize = new Sequelize(pgURI);
const Office = sequelize.define(
  'offices',
  {
    id: {
      type: Sequelize.INTEGER,
      required: true,
      primaryKey: true,
      autoIncrement: true
    },
    city: {
      type: Sequelize.STRING,
      required: true,
      unique: true
    }
  },
  { timestamps: false }
);

module.exports = Office;
