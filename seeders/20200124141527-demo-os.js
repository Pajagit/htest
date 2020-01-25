"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      "operatingsystems",
      [
        {
          title: "Windows 10"
        },
        {
          title: "Ubuntu 20.04"
        }
      ],
      {}
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("operatingsystems", null, {});
  }
};
