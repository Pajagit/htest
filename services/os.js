const Sequelize = require("sequelize");
const pgURI = require("../config/keys").postgresURI;
const sequelize = new Sequelize(pgURI);
const Op = Sequelize.Op;
const User = require("../models/user");
const MobileOS = require("../models/mobileos");
const paginate = require("../utils/pagination").paginate;

module.exports = {
  getMobileOperatingSystemsPaginated: async function(page, pageSize) {
    return new Promise((resolve, reject) => {
      MobileOS.findAndCountAll({
        order: [["title", "ASC"]],
        ...paginate({ page, pageSize })
      }).then(operatingsystems => {
        if (operatingsystems) {
          var pages = 1;
          if (operatingsystems.count > 0) {
            pages = Math.ceil(operatingsystems.count / pageSize);
          }
          var operating_systems = operatingsystems.rows;
          resolve({ operating_systems, pages, page: Number(page) });
        } else {
          resolve(false);
        }
      });
    });
  },
  getMobileOperatingSystems: async function() {
    return new Promise((resolve, reject) => {
      MobileOS.findAll({
        order: [["title", "ASC"]]
      }).then(operatingsystems => {
        if (operatingsystems) {
          var pages = 1;
          var page = 1;
          resolve({ operating_systems: operatingsystems, pages, page: page });
        } else {
          resolve(false);
        }
      });
    });
  },
  checkIfOsExists: async function(id) {
    return new Promise((resolve, reject) => {
      MobileOS.findOne({
        where: {
          id: id
        }
      }).then(operatingsystem => {
        if (operatingsystem) {
          resolve(true);
        } else {
          resolve(false);
        }
      });
    });
  }
};
