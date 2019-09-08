'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      'uploadedfiles',
      [
        {
          path: 'testtest.com',
          title: 'test',
          test_case_id: 1
        }
      ],
      {}
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('uploadedfiles', null, {});
  }
};
