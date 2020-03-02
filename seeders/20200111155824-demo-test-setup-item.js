"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      "testsetupitems",
      [
        {
          title: "Devices"
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
          title: "Simulators"
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
