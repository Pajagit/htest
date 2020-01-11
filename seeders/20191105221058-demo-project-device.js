"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      "projectdevices",
      [
        {
          project_id: 1,
          device_id: 1
        },
        {
          project_id: 1,
          device_id: 2
        },
        {
          project_id: 1,
          device_id: 3
        }
      ],
      {}
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("projectdevices", null, {});
  }
};
