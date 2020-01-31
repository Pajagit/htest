"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    const fakeTestCases = Array(1000).fill({
      title: "Test group ".concat(
        Math.random()
          .toString(36)
          .substring(2, 15) +
          Math.random()
            .toString(36)
            .substring(2, 15)
      ),
      pinned: false,
      project_id: 1,
      user_id: 1,
      color_id: 25
    });
    return queryInterface.bulkInsert("groups", fakeTestCases, {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("groups", null, {});
  }
};
