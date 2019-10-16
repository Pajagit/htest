"use strict";
const User = require("../models/user");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const users = await Promise.all([User.findAll()]);
    var usersObjects = [];
    if (users) {
      users[0].forEach(async function(user) {
        usersObjects.push({
          user_id: user.id,
          testcase_show_filters: true,
          testcase_view_mode: 1,
          project_id: null
        });
      });
    }

    return queryInterface.bulkInsert("usersettings", usersObjects, {});
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("settings", null, {});
  }
};
