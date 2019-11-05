const Sequelize = require("sequelize");
const pgURI = require("../config/keys").postgresURI;
const sequelize = new Sequelize(pgURI);
const Op = Sequelize.Op;
const User = require("../models/user");
const Simulator = require("../models/simulator");

const paginate = require("../utils/pagination").paginate;

module.exports = {
  getSimulatorsPaginated: async function(whereStatement, page, pageSize) {
    return new Promise((resolve, reject) => {
      Simulator.findAndCountAll({
        attributes: ["id", "title", "resolution", "dpi", "screen_size", "retina", "os"],
        where: whereStatement,
        ...paginate({ page, pageSize }),
        order: [["title", "ASC"]]
      }).then(simulator_obj => {
        var simulators = simulator_obj.rows;
        var pages = 1;
        if (simulator_obj.count > 0) {
          pages = Math.ceil(simulator_obj.count / pageSize);
        }
        page = Number(page);

        resolve({ simulators, page, pages });
      });
    });
  },
  getAllSimulators: async function(whereStatement) {
    return new Promise((resolve, reject) => {
      Simulator.findAll({
        attributes: ["id", "title", "resolution", "dpi", "screen_size", "retina", "os"],
        where: whereStatement,
        order: [["title", "ASC"]]
      }).then(simulators => {
        var page = 0;
        var pages = 0;
        if (simulators.length > 0) {
          pages = 1;
        }
        resolve({ simulators, page, pages });
      });
    });
  },
  createSimulator: async function(simulator_fields) {
    return new Promise((resolve, reject) => {
      Simulator.create(simulator_fields).then(simulator => {
        if (simulator) {
          resolve(simulator);
        } else {
          resolve(false);
        }
      });
    });
  },
  returnCreatedOrUpdatedSimulator: async function(createdOrUpdatedSimulator) {
    return new Promise((resolve, reject) => {
      if (createdOrUpdatedSimulator) {
        Simulator.findOne({
          attributes: ["id", "title", "resolution", "dpi", "screen_size", "retina", "os"],
          where: {
            id: createdOrUpdatedSimulator.id
          }
        }).then(simulator => {
          if (simulator) {
            resolve(simulator);
          } else {
            resolve(false);
          }
        });
      }
    });
  },
  checkIfSimulatorExistById: async function(id) {
    return new Promise((resolve, reject) => {
      Simulator.findOne({
        where: {
          id: id,
          deprecated: false
        }
      }).then(simulator => {
        if (simulator) {
          resolve(true);
        } else {
          resolve(false);
        }
      });
    });
  },
  updateSimulator: async function(id, simulatorFields) {
    return new Promise((resolve, reject) => {
      simulatorFields.updated_at = new Date();
      Simulator.update(simulatorFields, {
        where: { id: id },
        returning: true,
        plain: true
      }).then(simulator => {
        if (simulator[1]) {
          resolve(simulator[1]);
        } else {
          resolve(false);
        }
      });
    });
  },
  getSimulatorById: async function(id) {
    return new Promise((resolve, reject) => {
      if (id) {
        Simulator.findOne({
          attributes: ["id", "title", "resolution", "dpi", "emulator", "screen_size", "retina", "os"],
          where: {
            id: id,
            deprecated: false
          }
        }).then(simulator => {
          if (simulator) {
            resolve(simulator);
          } else {
            resolve(false);
          }
        });
      }
    });
  },
  setAsDeprecated: async function(id) {
    return new Promise((resolve, reject) => {
      Simulator.update(
        {
          deprecated: true,
          updated_at: new Date()
        },
        {
          where: {
            id: id
          }
        }
      ).then(simulator => {
        if (simulator) {
          resolve(true);
        } else {
          resolve(false);
        }
      });
    });
  }
};
