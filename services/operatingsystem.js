const Sequelize = require("sequelize");
const pgURI = require("../config/keys").postgresURI;
const sequelize = new Sequelize(pgURI);
const Op = Sequelize.Op;
const User = require("../models/user");
const OperatingSystem = require("../models/operatingsystem");
const ReportSettings = require("../models/reportsetting");

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

  getAllOperatingSystemsPaginated: async function(project_id, page, pageSize) {
    return new Promise((resolve, reject) => {
      OperatingSystem.findAndCountAll({
        where: {
          project_id: project_id,
          deprecated: false
        },
        attributes: ["id", "title", "used"],
        ...paginate({ page, pageSize }),
        order: [["id", "ASC"]]
      }).then(os_obj => {
        var oss = os_obj.rows;
        var pages = 1;
        if (os_obj.count > 0) {
          pages = Math.ceil(os_obj.count / pageSize);
        }
        page = Number(page);

        resolve({ oss, page, pages });
      });
    });
  },
  getAllOperatingSystems: async function(project_id) {
    return new Promise((resolve, reject) => {
      OperatingSystem.findAll({
        attributes: ["id", "title", "used"],
        where: {
          project_id: project_id,
          deprecated: false
        },
        order: [["id", "ASC"]]
      }).then(oss => {
        var page = 1;
        var pages = 0;
        if (oss.length > 0) {
          page = 1;
          pages = 1;
        }
        resolve({ oss, page, pages });
      });
    });
  },
  getOSProject: async function(id) {
    return new Promise((resolve, reject) => {
      OperatingSystem.findOne({
        attributes: ["project_id"],
        where: {
          id: id
        }
      }).then(os => {
        if (os) {
          resolve(os);
        } else {
          resolve(false);
        }
      });
    });
  },
  getOSById: async function(id) {
    return new Promise((resolve, reject) => {
      OperatingSystem.findOne({
        attributes: ["id", "title", "used"],
        where: {
          id: id,
          deprecated: false
        }
      }).then(os => {
        if (os) {
          resolve(os);
        } else {
          resolve(false);
        }
      });
    });
  },
  checkIfOSExists: async function(id) {
    return new Promise((resolve, reject) => {
      OperatingSystem.findOne({
        attributes: ["id"],
        where: {
          id: id,
          deprecated: false
        }
      }).then(os => {
        if (os) {
          resolve(true);
        } else {
          resolve(false);
        }
      });
    });
  },
  createOS: async function(os_fields) {
    return new Promise((resolve, reject) => {
      OperatingSystem.create(os_fields).then(os => {
        if (os) {
          var osObj = {};
          osObj.id = os.id;
          osObj.title = os.title;
          osObj.used = os.used;
          resolve(osObj);
        } else {
          resolve(false);
        }
      });
    });
  },
  returnCreatedOrUpdatedOS: async function(createdOrUpdatedOs) {
    return new Promise((resolve, reject) => {
      if (createdOrUpdatedOs) {
        OperatingSystem.findOne({
          attributes: ["id", "title", "used"],
          where: {
            id: createdOrUpdatedOs.id
          }
        }).then(os => {
          if (os) {
            resolve(os);
          } else {
            resolve(false);
          }
        });
      }
    });
  },
  updateOS: async function(id, osFields) {
    return new Promise((resolve, reject) => {
      osFields.updated_at = new Date();
      OperatingSystem.update(osFields, {
        where: { id: id },
        returning: true,
        plain: true
      }).then(os => {
        if (os[1]) {
          resolve(os[1]);
        } else {
          resolve(false);
        }
      });
    });
  },
  setAsDeprecated: async function(id) {
    return new Promise((resolve, reject) => {
      var osFields = {};
      osFields.updated_at = new Date();
      osFields.deprecated = true;
      osFields.used = false;
      OperatingSystem.update(osFields, {
        where: { id: id },
        returning: true,
        plain: true
      }).then(os => {
        if (os[1]) {
          resolve(os[1]);
        } else {
          resolve(false);
        }
      });
    });
  },
  setAsUsed: async function(id, used) {
    return new Promise((resolve, reject) => {
      var osFields = {};
      osFields.used = used;
      OperatingSystem.update(osFields, {
        where: { id: id },
        returning: true,
        plain: true
      }).then(os => {
        if (os[1]) {
          resolve(os[1]);
        } else {
          resolve(false);
        }
      });
    });
  },
  findAllOccurancesInReportSettings: async function(id) {
    return new Promise((resolve, reject) => {
      ReportSettings.findAll({
        where: {
          operatingsystems: {
            [Op.contains]: [id]
          }
        }
      }).then(setting => {
        if (setting) {
          resolve(setting);
        } else {
          resolve(false);
        }
      });
    });
  },
  removeAllOccurancesInReportSettings: async function(setting_id, newOparatingsystems) {
    return new Promise((resolve, reject) => {
      ReportSettings.update(
        { operatingsystems: newOparatingsystems },
        {
          where: {
            id: setting_id
          },
          returning: true,
          plain: true
        }
      ).then(updated_settings => {
        if (updated_settings) {
          resolve(true);
        } else {
          resolve(false);
        }
      });
    });
  }
};
