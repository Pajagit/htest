'use strict';
const { Pool } = require('pg');
const Sequelize = require('sequelize');
const pgURI = require('../config/keys').postgresURI;
const sequelize = new Sequelize(pgURI);
const Group = sequelize.define(
  'groups',
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
    pinned: {
      type: Sequelize.BOOLEAN,
      required: true
    },
    user_id: {
      type: Sequelize.INTEGER,
      required: true,
      foreignKey: true,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    color: {
      type: Sequelize.STRING,
      required: true
    },
    project_id: {
      type: Sequelize.INTEGER,
      required: true,
      foreignKey: true,
      references: {
        model: 'projects',
        key: 'id'
      }
    },
    created_at: {
      type: Sequelize.DATE,
      required: true
    },
    updated_at: {
      type: Sequelize.DATE,
      required: false
    }
  },
  { timestamps: false }
);
Group.associate = function(models) {
  // associations can be defined here
};
module.exports = Group;
