"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert("devices", [
      {
        title: "iPhone 7",
        resolution: "1334x750",
        dpi: "236ppi",
        udid: "6ec0d7145ddb8adbaec4e51437608774cb0d8b65",
        screen_size: '4,7"',
        retina: true,
        office_id: 1,
        deprecated: false,
        os: "iOS 7.1.2"
      },
      {
        title: "Samsung S8",
        resolution: "1440x2960",
        dpi: "570ppi",
        udid: null,
        screen_size: null,
        retina: false,
        office_id: 1,
        deprecated: false,
        os: "Lollipop 5.1.1"
      },
      {
        title: "Samsung S8",
        resolution: "1440x2960",
        dpi: "570ppi",
        udid: null,
        screen_size: null,
        retina: false,
        office_id: 2,
        deprecated: false,
        os: "Lollipop 5.1.1"
      },
      {
        title: "Huawei P9",
        resolution: "1080x1920",
        dpi: "423ppi",
        udid: null,
        screen_size: '5,1"',
        retina: false,
        office_id: 1,
        deprecated: false,
        os: "Lollipop 5.1.1"
      },
      {
        title: "iPhone 4",
        resolution: "640x960",
        dpi: "330ppi",
        udid: "6ec0d7135dda8cdbaec9e51437608774cb0d8b65",
        screen_size: '3,5"',
        retina: true,
        office_id: 1,
        deprecated: true,
        os: "iOS 13.1.2"
      }
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("devices", null, {});
  }
};
