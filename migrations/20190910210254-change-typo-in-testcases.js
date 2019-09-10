'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.renameColumn('testcases', 'depricated', 'deprecated');
  },

  down: (queryInterface, Sequelize) => {}
};
