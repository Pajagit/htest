const Sequelize = require("sequelize");
const pgURI = require("../config/keys").postgresURI;
const sequelize = new Sequelize(pgURI);
const Op = Sequelize.Op;
const User = require("../models/user");
const OperatingSystem = require("../models/operatingsystem");
const paginate = require("../utils/pagination").paginate;

module.exports = {
  checkIfOsExists: async function(id) {
    return new Promise((resolve, reject) => {
      OperatingSystem.findOne({
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
  },
  getAllOperatingSystemsPaginated: async function(page, pageSize) {
    return new Promise((resolve, reject) => {
      OperatingSystem.findAndCountAll({
        attributes: ["id", "title"],
        ...paginate({ page, pageSize }),
        order: [["title", "ASC"]]
      }).then(os_obj => {
        var operatingsystem = os_obj.rows;
        var pages = 1;
        if (os_obj.count > 0) {
          pages = Math.ceil(os_obj.count / pageSize);
        }
        page = Number(page);

        resolve({ operatingsystem, page, pages });
      });
    });
  },
  getAllOperatingSystems: async function() {
    return new Promise((resolve, reject) => {
      OperatingSystem.findAll({
        attributes: ["id", "title"],
        order: [["title", "ASC"]]
      }).then(operatingsystems => {
        var page = 1;
        var pages = 0;
        if (operatingsystems.length > 0) {
          page = 1;
          pages = 1;
        }
        resolve({ operatingsystems, page, pages });
      });
    });
  }
};
