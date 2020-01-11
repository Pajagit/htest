"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      "testsetupitems",
      [
        {
          title: "Devices / Simulators"
        },
        {
          title: "Browsers"
        },
        {
          title: "Versions"
        },
        {
          title: "Operating Systems"
        },
        {
          title: "Environments"
        },
        {
          title: "Aditional Conditions"
        },
        {
          title: "Upload files"
        }
      ],
      {}
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("testsetupitems", null, {});
  }
};
