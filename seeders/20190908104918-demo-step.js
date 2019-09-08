'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      'teststeps',
      [
        {
          title: 'enter parameters',
          test_case_id: 1
        }
      ],
      {}
    );
  },

  down: (queryInterface, Sequelize) => {
    // return queryInterface.bulkDelete('teststeps', null, {});
  }
};
