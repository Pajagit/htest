"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      "environments",
      [
        {
          title: "dev",
          project_id: 1
        },
        {
          title: "stage",
          project_id: 1
        },
        {
          title: "prod",
          project_id: 1
        }
      ],
      {}
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("environments", null, {});
  }
};
