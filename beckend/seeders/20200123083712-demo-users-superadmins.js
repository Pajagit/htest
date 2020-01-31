"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      "userroleprojects",
      [
        {
          user_id: 1,
          role_id: 4
        },
        {
          user_id: 2,
          role_id: 4
        },
        {
          user_id: 3,
          role_id: 4
        },
        {
          user_id: 4,
          role_id: 4
        },
        {
          user_id: 5,
          role_id: 4
        },
        {
          user_id: 6,
          role_id: 4
        },
        {
          user_id: 7,
          role_id: 4
        },
        {
          user_id: 8,
          role_id: 4
        },
        {
          user_id: 9,
          role_id: 4
        },
        {
          user_id: 10,
          role_id: 4
        }
      ],
      {}
    );
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('People', null, {});
    */
  }
};
