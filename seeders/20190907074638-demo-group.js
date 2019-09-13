"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      "groups",
      [
        {
          title: "Login",
          user_id: 1,
          project_id: 1,
          color_id: 1
        }
      ],
      {}
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("groups", null, {});
  }
};
