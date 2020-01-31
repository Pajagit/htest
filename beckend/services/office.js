const Sequelize = require("sequelize");
const pgURI = require("../config/keys").postgresURI;
const sequelize = new Sequelize(pgURI);
const Op = Sequelize.Op;
const User = require("../models/user");
const Device = require("../models/device");
const Office = require("../models/office");

module.exports = {
  checkIfOfficeExists: async function(id) {
    return new Promise((resolve, reject) => {
      Office.findOne({
        where: {
          id: id
        }
      }).then(office => {
        if (office) {
          resolve(true);
        } else {
          resolve(false);
        }
      });
    });
  }
};
