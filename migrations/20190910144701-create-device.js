'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('devices', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false
      },
      resolution: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: null
      },
      dpi: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: null
      },
      udid: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: null
      },
      screen_size: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: null
      },
      retina: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      office_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'offices',
          key: 'id'
        },
        allowNull: true,
        defaultValue: null
      },
      simulator: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      deleted: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: true,
        type: Sequelize.DATE,
        defaultValue: null
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('devices');
  }
};