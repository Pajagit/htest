"use strict";
const Sequelize = require("sequelize");
const pgURI = require("../config/keys").postgresURI;
const sequelize = new Sequelize(pgURI);
const User = sequelize.define(
  "users",
  {
    id: {
      type: Sequelize.INTEGER,
      required: true,
      primaryKey: true,
      autoIncrement: true
    },
    first_name: {
      type: Sequelize.STRING
    },
    email: {
      type: Sequelize.STRING
    },
    last_name: {
      type: Sequelize.STRING
    },
    position: {
      type: Sequelize.STRING
    },
    active: {
      type: Sequelize.BOOLEAN
    },
    image_url: {
      type: Sequelize.STRING
    },
    created_at: {
      type: Sequelize.DATE
    },
    updated_at: {
      type: Sequelize.DATE
    }
  },
  { timestamps: false }
);
User.associate = function(models) {
  // associations can be defined here
};
module.exports = User;
