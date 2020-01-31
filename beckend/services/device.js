const Sequelize = require("sequelize");
const pgURI = require("../config/keys").postgresURI;
const sequelize = new Sequelize(pgURI);
const Op = Sequelize.Op;
const User = require("../models/user");
const Device = require("../models/device");
const Office = require("../models/office");
const ProjectDevice = require("../models/projectdevice");
const Project = require("../models/project");

const paginate = require("../utils/pagination").paginate;

module.exports = {
  getDevicesPaginated: async function(whereStatement, page, pageSize, project_id) {
    return new Promise((resolve, reject) => {
      Device.findAndCountAll({
        attributes: ["id", "title", "resolution", "dpi", "udid", "screen_size", "retina", "os"],
        where: whereStatement,
        include: [
          {
            model: Office,
            attributes: ["id", "city"],
            required: false
          },

          {
            model: Project,
            attributes: ["id"],
            through: {
              attributes: []
            },
            as: "projects",
            required: false
          }
        ],
        ...paginate({ page, pageSize }),
        order: [
          ["title", "ASC"],
          [Office, "id", "ASC"]
        ]
      }).then(devices_obj => {
        var devicesObjWithUsed = Array();
        devices_obj.rows.forEach(device => {
          var deviceObjectToReturn = {};
          deviceObjectToReturn.id = device.id;
          deviceObjectToReturn.title = device.title;
          deviceObjectToReturn.resolution = device.resolution;
          deviceObjectToReturn.dpi = device.dpi;
          deviceObjectToReturn.udid = device.udid;
          deviceObjectToReturn.screen_size = device.screen_size;
          deviceObjectToReturn.retina = device.retina;
          deviceObjectToReturn.os = device.os;
          deviceObjectToReturn.office = device.office;

          if (project_id) {
            var used = false;
            if (device.projects) {
              device.projects.forEach(deviceProject => {
                if (deviceProject.id == project_id) {
                  used = true;
                }
              });
            }
            deviceObjectToReturn.used = used;
          }
          devicesObjWithUsed.push(deviceObjectToReturn);
        });

        var devices = devicesObjWithUsed;
        var pages = 1;
        if (devices_obj.count > 0) {
          pages = Math.ceil(devices_obj.count / pageSize);
        }
        page = Number(page);

        resolve({ devices, page, pages });
      });
    });
  },
  getAllDevices: async function(whereStatement) {
    return new Promise((resolve, reject) => {
      Device.findAll({
        attributes: ["id", "title", "resolution", "dpi", "udid", "screen_size", "retina", "os"],
        where: whereStatement,
        include: [
          {
            model: Office,
            attributes: ["id", "city"],
            required: false
          }
        ],
        order: [
          ["title", "ASC"],
          [Office, "id", "ASC"]
        ]
      }).then(devices => {
        var page = 0;
        var pages = 0;
        if (devices.length > 0) {
          pages = 1;
        }
        resolve({ devices, page, pages });
      });
    });
  },
  createDevice: async function(device_fields) {
    return new Promise((resolve, reject) => {
      Device.create(device_fields).then(device => {
        if (device) {
          resolve(device);
        } else {
          resolve(false);
        }
      });
    });
  },
  returnCreatedOrUpdatedDevice: async function(createdOrUpdatedDevice) {
    return new Promise((resolve, reject) => {
      if (createdOrUpdatedDevice) {
        Device.findOne({
          attributes: ["id", "title", "resolution", "dpi", "udid", "screen_size", "retina", "os"],
          where: {
            id: createdOrUpdatedDevice.id
          },
          include: [
            {
              model: Office,
              attributes: ["id", "city"],
              required: false
            }
          ]
        }).then(device => {
          if (device) {
            resolve(device);
          } else {
            resolve(false);
          }
        });
      }
    });
  },
  checkIfDeviceExistById: async function(id) {
    return new Promise((resolve, reject) => {
      Device.findOne({
        where: {
          id: id,
          deprecated: false
        }
      }).then(device => {
        if (device) {
          resolve(true);
        } else {
          resolve(false);
        }
      });
    });
  },
  updateDevice: async function(id, deviceFields) {
    return new Promise((resolve, reject) => {
      deviceFields.updated_at = new Date();
      Device.update(deviceFields, {
        where: { id: id },
        returning: true,
        plain: true
      }).then(device => {
        if (device[1]) {
          resolve(device[1]);
        } else {
          resolve(false);
        }
      });
    });
  },
  deleteDevice: async function(id) {
    return new Promise((resolve, reject) => {
      Device.update(
        {
          deprecated: true
        },
        {
          where: {
            id: id
          }
        }
      ).then(device => {
        if (device) {
          resolve(true);
        } else {
          resolve(false);
        }
      });
    });
  },
  getDeviceById: async function(id, isRealDevice) {
    return new Promise((resolve, reject) => {
      if (id) {
        Device.findOne({
          attributes: ["id", "title", "resolution", "dpi", "udid", "screen_size", "retina", "os"],
          where: {
            id: id,
            deprecated: false
          },
          include: [
            {
              model: Office,
              attributes: ["id", "city"],
              required: false
            }
          ]
        }).then(device => {
          if (device) {
            resolve(device);
          } else {
            resolve(false);
          }
        });
      }
    });
  },
  setAsDeprecated: async function(id) {
    return new Promise((resolve, reject) => {
      Device.update(
        {
          deprecated: true,
          updated_at: new Date()
        },
        {
          where: {
            id: id
          }
        }
      ).then(device => {
        if (device) {
          resolve(true);
        } else {
          resolve(false);
        }
      });
    });
  },
  checkIfUsed: async function(id, project_id) {
    return new Promise((resolve, reject) => {
      ProjectDevice.findOne({
        where: {
          project_id: project_id,
          device_id: id
        }
      }).then(device => {
        if (device) {
          resolve(true);
        } else {
          resolve(false);
        }
      });
    });
  },
  checkIfUsedOnAnyProject: async function(id) {
    return new Promise((resolve, reject) => {
      ProjectDevice.count({
        where: {
          device_id: id
        }
      }).then(devices => {
        if (devices > 0) {
          resolve(true);
        } else {
          resolve(false);
        }
      });
    });
  },
  setIsUsed: async function(id, project_id, used) {
    return new Promise((resolve, reject) => {
      if (used === "true") {
        var projectDeviceFields = {};
        projectDeviceFields.project_id = project_id;
        projectDeviceFields.device_id = id;
        ProjectDevice.create(projectDeviceFields).then(device => {
          if (device) {
            resolve(device);
          } else {
            resolve(false);
          }
        });
      } else {
        ProjectDevice.destroy({
          where: {
            project_id: project_id,
            device_id: id
          }
        }).then(device => {
          if (device) {
            resolve(device);
          } else {
            resolve(false);
          }
        });
      }
    });
  },
  removeFromProjects: async function(id) {
    return new Promise((resolve, reject) => {
      ProjectDevice.destroy({
        where: {
          device_id: id
        }
      }).then(device => {
        if (device) {
          resolve(device);
        } else {
          resolve(false);
        }
      });
    });
  },
  updateProjectDevices: async function(id_old_device, new_device) {
    return new Promise((resolve, reject) => {
      ProjectDevice.update(
        { device_id: new_device.id },
        {
          where: { device_id: id_old_device },
          returning: true,
          plain: true
        }
      ).then(device => {
        if (device) {
          resolve(true);
        } else {
          resolve(false);
        }
      });
    });
  }
};
