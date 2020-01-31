"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      "projecttestsetupitems",
      [
        {
          project_id: 1,
          testsetupitem_id: 1
        },
        {
          project_id: 1,
          testsetupitem_id: 2
        }
      ],
      {}
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("projecttestsetupitems", null, {});
  }
};
