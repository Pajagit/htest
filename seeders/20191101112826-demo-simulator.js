"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      "simulators",
      [
        {
          title: "iPhone 8",
          retina: true,
          project_id: 1
        },
        {
          title: "iPhone 7",
          retina: true,
          project_id: 1
        },
        {
          title: "Huawei P9",
          retina: true,
          project_id: 1
        }
      ],
      {}
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("simulators", null, {});
  }
};
