"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      "operatingsystems",
      [
        {
          title: "Windows 10",
          project_id: 1,
          used: true,
          deprecated: false
        },
        {
          title: "Ubuntu 20.04",
          project_id: 1,
          used: true,
          deprecated: false
        }
      ],
      {}
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("operatingsystems", null, {});
  }
};
