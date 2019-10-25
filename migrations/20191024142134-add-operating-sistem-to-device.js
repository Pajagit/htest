"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface
      .addColumn("devices", "os", {
        type: Sequelize.STRING,
        allowNull: true
      })
      .then(
        queryInterface
          .bulkUpdate("devices", {
            os: "iOS 13.1.3"
          })
          .then(
            queryInterface.changeColumn("devices", "os", {
              type: Sequelize.STRING,
              allowNull: false
            })
          )
      );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn("devices", "os");
  }
};
