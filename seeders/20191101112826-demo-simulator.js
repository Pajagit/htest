"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      "simulators",
      [
        {
          title: "iPhone 8",
          retina: true
        },
        {
          title: "iPhone 7",
          retina: true
        },
        {
          title: "Huawei P9",
          retina: true
        }
      ],
      {}
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("simulators", null, {});
  }
};
