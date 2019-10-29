const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const Version = require("../models/version");
const paginate = require("../utils/pagination").paginate;

module.exports = {
  getAllVersions: async function(project_id) {
    return new Promise((resolve, reject) => {
      Version.findAll({
        attributes: ["id", "version", "is_supported", "support_stopped_at"],
        where: {
          project_id: project_id,
          deleted: false
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
          deleted: false
        },
        attributes: ["id", "version", "is_supported", "support_stopped_at"],
        ...paginate({ page, pageSize }),
        order: [["version", "ASC"]]
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
        attributes: ["id", "version", "is_supported", "support_stopped_at"],
        where: {
          id: id,
          deleted: false
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
  createVersion: async function(version_fields) {
    return new Promise((resolve, reject) => {
      Version.create(version_fields).then(version => {
        if (version) {
          resolve(version);
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
          attributes: ["id", "version", "is_supported", "support_stopped_at"],
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
  deleteVersion: async function(id) {
    return new Promise((resolve, reject) => {
      Version.update(
        {
          deleted: true
        },
        {
          where: {
            id: id
          }
        }
      ).then(version => {
        if (version) {
          resolve(true);
        } else {
          resolve(false);
        }
      });
    });
  }
};
