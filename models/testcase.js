'use strict';
const { Pool } = require('pg');
const Sequelize = require('sequelize');
const pgURI = require('../config/keys').postgresURI;
const sequelize = new Sequelize(pgURI, {
  operatorsAliases: false
});

const Group = require('./Group');
const GroupTestCase = require('./GroupTestCase');
const Link = require('./Link');
const TestStep = require('./TestStep');
const UploadedFile = require('./UploadedFile');

const TestCase = sequelize.define(
  'testcases',
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
    description: {
      type: Sequelize.STRING,
      required: true
    },
    expected_result: {
      type: Sequelize.STRING,
      required: false
    },
    preconditions: {
      type: Sequelize.STRING,
      required: false
    },
    depricated: {
      type: Sequelize.BOOLEAN,
      required: true
    },
    project_id: {
      type: Sequelize.INTEGER,
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
    }
  },
  {}
);

TestCase.belongsToMany(Group, {
  through: GroupTestCase,
  foreignKey: 'test_case_id',
  targetKey: 'id',
  as: 'groups'
});
Group.belongsToMany(TestCase, {
  through: GroupTestCase,
  foreignKey: 'group_id',
  targetKey: 'id',
  as: 'testcases'
});
TestCase.hasMany(Link, {
  foreignKey: 'test_case_id',
  targetKey: 'id'
});
TestCase.hasMany(UploadedFile, {
  foreignKey: 'test_case_id',
  targetKey: 'id',
  as: 'uploaded_files'
});
TestCase.hasMany(TestStep, {
  foreignKey: 'test_case_id',
  targetKey: 'id',
  as: 'test_steps'
});

module.exports = TestCase;
