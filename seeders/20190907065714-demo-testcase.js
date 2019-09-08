'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      'testcases',
      [
        {
          title: 'Test login functionality',
          expected_result: 'Succesful login',
          user_id: 1,
          project_id: 1
        }
      ],
      {}
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('testcases', null, {});
  }
};
