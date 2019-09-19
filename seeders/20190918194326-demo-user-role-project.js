"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      "userroleprojects",
      [
        {
          role_id: 1,
          project_id: 1,
          user_id: 1
        }
      ],
      {}
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("userroleprojects", null, {});
  }
};
