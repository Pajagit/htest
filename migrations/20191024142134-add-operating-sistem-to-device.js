"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn("devices", "operating_system_id", {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: "operatingsystems",
        key: "id"
      },
      defaultValue: 1
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn("devices", "operating_system_id");
  }
};
