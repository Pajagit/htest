const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const Version = require("../models/version");
const ReportSettings = require("../models/reportsetting");

const paginate = require("../utils/pagination").paginate;

module.exports = {
  getAllVersions: async function(project_id) {
    return new Promise((resolve, reject) => {
      Version.findAll({
        attributes: ["id", "version", "used"],
        where: {
          project_id: project_id,
          deprecated: false
        },
        order: [["version", "ASC"]]
      }).then(versions => {
        var page = 1;
        var pages = 0;
        if (versions.length > 0) {
          page = 1;
          pages = 1;
        }
        resolve({ versions, page, pages });
      });
    });
  },
  getAllVersionsPaginated: async function(project_id, page, pageSize) {
    return new Promise((resolve, reject) => {
      Version.findAndCountAll({
        where: {
          project_id: project_id,
          deprecated: false
        },
        attributes: ["id", "version", "used"],
        ...paginate({ page, pageSize }),
        order: [["id", "DESC"]]
      }).then(version_obj => {
        var versions = version_obj.rows;
        var pages = 1;
        if (version_obj.count > 0) {
          pages = Math.ceil(version_obj.count / pageSize);
        }
        page = Number(page);

        resolve({ versions, page, pages });
      });
    });
  },
  getVersionProject: async function(id) {
    return new Promise((resolve, reject) => {
      Version.findOne({
        attributes: ["project_id"],
        where: {
          id: id
        }
      }).then(version => {
        if (version) {
          resolve(version);
        } else {
          resolve(false);
        }
      });
    });
  },
  getVersionById: async function(id) {
    return new Promise((resolve, reject) => {
      Version.findOne({
        attributes: ["id", "version", "used"],
        where: {
          id: id,
          deprecated: false
        }
      }).then(version => {
        if (version) {
          resolve(version);
        } else {
          resolve(false);
        }
      });
    });
  },
  checkIfVersionExists: async function(id) {
    return new Promise((resolve, reject) => {
      Version.findOne({
        attributes: ["id"],
        where: {
          id: id,
          deprecated: false
        }
      }).then(version => {
        if (version) {
          resolve(true);
        } else {
          resolve(false);
        }
      });
    });
  },
  createVersion: async function(version_fields) {
    return new Promise((resolve, reject) => {
      Version.create(version_fields).then(version => {
        if (version) {
          var versionObj = {};
          versionObj.id = version.id;
          versionObj.version = version.version;
          versionObj.used = version.used;
          resolve(versionObj);
        } else {
          resolve(false);
        }
      });
    });
  },
  returnCreatedOrUpdatedVersion: async function(createdOrUpdatedVersion) {
    return new Promise((resolve, reject) => {
      if (createdOrUpdatedVersion) {
        Version.findOne({
          attributes: ["id", "version", "used"],
          where: {
            id: createdOrUpdatedVersion.id
          }
        }).then(version => {
          if (version) {
            resolve(version);
          } else {
            resolve(false);
          }
        });
      }
    });
  },
  updateVersion: async function(id, versionFields) {
    return new Promise((resolve, reject) => {
      versionFields.updated_at = new Date();
      Version.update(versionFields, {
        where: { id: id },
        returning: true,
        plain: true
      }).then(version => {
        if (version[1]) {
          resolve(version[1]);
        } else {
          resolve(false);
        }
      });
    });
  },
  setAsDeprecated: async function(id) {
    return new Promise((resolve, reject) => {
      var versionFields = {};
      versionFields.updated_at = new Date();
      versionFields.deprecated = true;
      versionFields.used = false;
      Version.update(versionFields, {
        where: { id: id },
        returning: true,
        plain: true
      }).then(version => {
        if (version[1]) {
          resolve(version[1]);
        } else {
          resolve(false);
        }
      });
    });
  },
  setAsUsed: async function(id, used) {
    return new Promise((resolve, reject) => {
      var versionFields = {};
      versionFields.used = used;
      Version.update(versionFields, {
        where: { id: id },
        returning: true,
        plain: true
      }).then(version => {
        if (version[1]) {
          resolve(version[1]);
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
          versions: {
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
  removeAllOccurancesInReportSettings: async function(setting_id, newVersions) {
    return new Promise((resolve, reject) => {
      ReportSettings.update(
        { versions: newVersions },
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
