'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      'users',
      [
        {
          first_name: 'Jana',
          last_name: 'Antic',
          email: 'jana.antic@htecgroup.com',
          password: 'test1234',
          position: 'qa',
          active: true
        }
      ],
      {}
    );
  },

  down: (queryInterface, Sequelize) => {
    // return queryInterface.bulkDelete('users', null, {});
  }
};
