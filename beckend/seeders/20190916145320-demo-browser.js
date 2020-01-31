"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert("browsers", [
      {
        title: "Firefox",
        screen_resolution: "1334x750",
        version: "33",
        deprecated: false,
        project_id: 1,
        used: false
      },
      {
        title: "Chrome",
        screen_resolution: "1920x1080",
        version: "32",
        deprecated: false,
        project_id: 1,
        used: false
      },
      {
        title: "Safari",
        screen_resolution: "1334x750",
        version: "35",
        deprecated: false,
        project_id: 1,
        used: false
      },
      {
        title: "Opera",
        screen_resolution: null,
        version: null,
        deprecated: true,
        project_id: 1,
        used: false
      },
      {
        title: "Chrome",
        screen_resolution: null,
        version: "36",
        deprecated: false,
        project_id: 1,
        used: false
      },
      {
        title: "Firefox",
        screen_resolution: null,
        version: "32",
        deprecated: false,
        project_id: 1,
        used: false
      }
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("browsers", null, {});
  }
};
