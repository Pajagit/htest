const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const Report = require("../models/report");
const paginate = require("../utils/pagination").paginate;

module.exports = {
  createReport: async function(report_fields) {
    return new Promise((resolve, reject) => {
      Report.create(report_fields).then(report => {
        if (report) {
          //   var reportObj = {};
          //   reportObj.id = report.id;
          //   reportObj.title = report.title;
          //   reportObj.screen_resolution = report.screen_resolution;
          //   reportObj.version = report.version;
          //   reportObj.used = report.used;
          resolve(report);
        } else {
          resolve(false);
        }
      });
    });
  }
};
