"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn("reportsteps", "expected_result", {
      type: Sequelize.STRING(150),
      allowNull: true
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn("reportsteps", "expected_result");
  }
};
