"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert("browsers", [
      {
        title: "Firefox",
        screen_resolution: "1334x750",
        version: "33",
        deleted: false
      },
      {
        title: "Chrome",
        screen_resolution: "1920x1080",
        version: "32",
        deleted: false
      },
      {
        title: "Safari",
        screen_resolution: "1334x750",
        version: "35",
        deleted: false
      },
      {
        title: "Opera",
        screen_resolution: null,
        version: null,
        deleted: true
      },
      {
        title: "Chrome",
        screen_resolution: null,
        version: "36",
        deleted: false
      },
      {
        title: "Firefox",
        screen_resolution: null,
        version: "32",
        deleted: false
      }
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("browsers", null, {});
  }
};
