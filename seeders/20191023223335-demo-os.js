"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      "operatingsystems",
      [
        {
          title: "Android",
          version: "4.0"
        },
        {
          title: "Android",
          version: "4.1"
        },
        {
          title: "iOS",
          version: "11.0"
        },
        {
          title: "iOS",
          version: "11.0"
        }
      ],
      {}
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("operatingsystems", null, {});
  }
};
