"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      "versions",
      [
        {
          version: "1.0",
          used: false,
          project_id: 1
        },
        {
          version: "1.1",
          used: true,
          project_id: 1
        },
        {
          version: "1.2",
          used: true,
          project_id: 1
        }
      ],
      {}
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("versions", null, {});
  }
};
