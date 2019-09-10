'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('offices', [
      {
        city: 'Nis'
      },
      {
        city: 'Belgrade'
      },
      {
        city: 'Novi Sad'
      },
      {
        city: 'Banja Luka'
      }
    ])

  },

  down: (queryInterface, Sequelize) => {

    return queryInterface.bulkDelete('offices', null, {});

  }
};
