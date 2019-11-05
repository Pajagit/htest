"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      "projectsimulators",
      [
        {
          project_id: 1,
          simulator_id: 1
        },
        {
          project_id: 1,
          simulator_id: 2
        },
        {
          project_id: 1,
          simulator_id: 3
        }
      ],
      {}
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("projectsimulators", null, {});
  }
};
