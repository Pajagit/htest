const Sequelize = require("sequelize");
const pgURI = require("../config/keys").postgresURI;
const sequelize = new Sequelize(pgURI);
const Op = Sequelize.Op;
const User = require("../models/user");
const Device = require("../models/device");
const Office = require("../models/office");

const paginate = require("../utils/pagination").paginate;

module.exports = {
  getDevicesPaginated: async function(whereStatement, page, pageSize) {
    return new Promise((resolve, reject) => {
      Device.findAndCountAll({
        attributes: ["id", "title", "resolution", "dpi", "udid", "screen_size", "retina", "simulator", "deleted"],
        where: whereStatement,
        include: [
          {
            model: Office,
            attributes: ["id", "city"],
            required: false
          }
        ],
        ...paginate({ page, pageSize }),
        order: [["title", "ASC"], [Office, "id", "ASC"]]
      }).then(devices_obj => {
        var devices = devices_obj.rows;
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
        attributes: ["id", "title", "resolution", "dpi", "udid", "screen_size", "retina", "simulator", "deleted"],
        where: whereStatement,
        include: [
          {
            model: Office,
            attributes: ["id", "city"],
            required: false
          }
        ],
        order: [["title", "ASC"], [Office, "id", "ASC"]]
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
          attributes: ["id", "title", "resolution", "dpi", "udid", "screen_size", "retina", "simulator", "deleted"],
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
          deleted: false
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
          deleted: true
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
  getDeviceById: async function(id) {
    return new Promise((resolve, reject) => {
      if (id) {
        Device.findOne({
          attributes: ["id", "title", "resolution", "dpi", "udid", "screen_size", "retina", "simulator", "deleted"],
          where: {
            id: id
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
  }
};
