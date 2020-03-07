"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn("links", "title", {
      type: Sequelize.STRING(150),
      allowNull: true
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn("links", "title");
  }
};
