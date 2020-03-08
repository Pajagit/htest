"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.renameTable("projectsettings", "testcasesettings");
  },

  down: (queryInterface, Sequelize) => {
    queryInterface.renameTable("testcasesettings", "projectsettings");
  }
};
