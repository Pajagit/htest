"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      "statuses",
      [
        {
          title: "Passed"
        },
        {
          title: "Failed"
        }
      ],
      {}
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("statuses", null, {});
  }
};
