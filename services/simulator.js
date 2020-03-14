const Sequelize = require("sequelize");
const pgURI = require("../config/keys").postgresURI;
const sequelize = new Sequelize(pgURI);
const Op = Sequelize.Op;
const User = require("../models/user");
const Simulator = require("../models/simulator");
const ProjectSimulator = require("../models/projectsimulator");
const ReportSettings = require("../models/reportsetting");

const paginate = require("../utils/pagination").paginate;

module.exports = {
  getSimulatorsPaginated: async function(whereStatement, page, pageSize) {
    return new Promise((resolve, reject) => {
      Simulator.findAndCountAll({
        attributes: ["id", "title", "resolution", "dpi", "screen_size", "retina", "os", "used", "emulator"],
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
        attributes: ["id", "title", "resolution", "dpi", "screen_size", "retina", "os", "used"],
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
          attributes: ["id", "title", "resolution", "dpi", "screen_size", "retina", "os", "used", "emulator"],
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
          attributes: ["id", "title", "resolution", "dpi", "emulator", "screen_size", "retina", "os", "used"],
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
          used: false,
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
  },
  checkIfUsed: async function(id, project_id) {
    return new Promise((resolve, reject) => {
      ProjectSimulator.findOne({
        where: {
          project_id: project_id,
          simulator_id: id
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
  getSimulatorProject: async function(id) {
    return new Promise((resolve, reject) => {
      Simulator.findOne({
        attributes: ["project_id"],
        where: {
          id: id
        }
      }).then(simulator => {
        if (simulator) {
          resolve(simulator);
        } else {
          resolve(false);
        }
      });
    });
  },
  setAsUsed: async function(id, used) {
    return new Promise((resolve, reject) => {
      var simulatorFields = {};
      simulatorFields.used = used;
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
  checkIfUsedOnAnyProject: async function(id) {
    return new Promise((resolve, reject) => {
      ProjectSimulator.count({
        where: {
          simulator_id: id
        }
      }).then(simulator => {
        if (simulator > 0) {
          resolve(true);
        } else {
          resolve(false);
        }
      });
    });
  },
  removeFromProjects: async function(id) {
    return new Promise((resolve, reject) => {
      ProjectSimulator.destroy({
        where: {
          simulator_id: id
        }
      }).then(simulator => {
        if (simulator) {
          resolve(simulator);
        } else {
          resolve(false);
        }
      });
    });
  },
  updateProjectSimulators: async function(id_old_simulator, new_simulator) {
    return new Promise((resolve, reject) => {
      ProjectSimulator.update(
        { simulator_id: new_simulator.id },
        {
          where: { simulator_id: id_old_simulator },
          returning: true,
          plain: true
        }
      ).then(simulator => {
        if (simulator) {
          resolve(true);
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
          simulators: {
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
  removeAllOccurancesInReportSettings: async function(setting_id, newSimulators) {
    return new Promise((resolve, reject) => {
      ReportSettings.update(
        { simulators: newSimulators },
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
