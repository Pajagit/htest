const Sequelize = require("sequelize");
const pgURI = require("../config/keys").postgresURI;
const sequelize = new Sequelize(pgURI);
const Op = Sequelize.Op;
const Status = require("../models/status");
const paginate = require("../utils/pagination").paginate;

module.exports = {
  checkIfStatusExist: async function(id) {
    return new Promise((resolve, reject) => {
      Status.findOne({
        where: {
          id: id
        }
      }).then(status => {
        if (status) {
          resolve(true);
        } else {
          resolve(false);
        }
      });
    });
  }
};
