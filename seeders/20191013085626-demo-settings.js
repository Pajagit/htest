"use strict";
const User = require("../models/user");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const users = await Promise.all([User.findAll()]);
    var usersObjects = [];
    if (users) {
      users[0].forEach(user => {
        usersObjects.push({
          user_id: user.id,
          testcase_date_from: null,
          testcase_date_to: null,
          testcase_search_term: null
        });
      });
    }

    return queryInterface.bulkInsert("settings", usersObjects, {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("settings", null, {});
  }
};
