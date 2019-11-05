const Sequelize = require("sequelize");
const pgURI = require("../config/keys").postgresURI;
const sequelize = new Sequelize(pgURI);
const Op = Sequelize.Op;
const SimulatorService = require("../services/simulator");
const UserService = require("../services/user");
const OSService = require("../services/os");
const validateGetSimulator = require("../validation/simulator").validateGetSimulator;
const validateSimulatorInput = require("../validation/simulator").validateSimulatorInput;

module.exports = {
  getSimulators: async function(req, res) {
    var canGetDevice = await UserService.canGetDeviceAndSimulator(req.user);
    if (!canGetDevice) {
      return res.status(403).json({ message: "Forbidden" });
    }
    const { errors, isValid } = validateGetSimulator(req.query);

    // Check Validation
    if (!isValid) {
      return res.status(400).json(errors);
    }

    var whereStatement = {};
    whereStatement.deprecated = false;
    if (typeof req.query.emulator === "string") {
      whereStatement.emulator = req.query.emulator;
    }
    if (req.query.page >= 0 && req.query.page_size) {
      var simulators = await SimulatorService.getSimulatorsPaginated(
        whereStatement,
        req.query.page,
        req.query.page_size
      );
    } else {
      var simulators = await SimulatorService.getAllSimulators(whereStatement);
    }
    if (simulators) {
      return res.status(200).json(simulators);
    } else {
      return res.status(500).json({ error: "Something went wrong" });
    }
  },
  updateSimulator: async function(req, res) {
    var canUpdateSimulator = await UserService.canCreateUpdateDeleteSimulator(req.user);
    if (!canUpdateSimulator) {
      return res.status(403).json({ message: "Forbidden" });
    }
    if (isNaN(req.params.id)) {
      return res.status(400).json({ error: "Simulator id is not valid number" });
    } else {
      const { errors, isValid } = validateSimulatorInput(req.body, false);
      // Check Validation
      if (!isValid) {
        return res.status(400).json(errors);
      }

      var simulatorFields = {};
      simulatorFields.title = req.body.title;
      if (req.body.resolution) {
        simulatorFields.resolution = req.body.resolution;
      }
      if (req.body.dpi) {
        simulatorFields.dpi = req.body.dpi;
      }
      if (req.body.screen_size) {
        simulatorFields.screen_size = req.body.screen_size;
      }
      simulatorFields.retina = req.body.retina;
      simulatorFields.os = req.body.os;

      if (typeof req.body.emulator === "string") {
        simulatorFields.emulator = req.body.emulator;
      }
      (async () => {
        var simulatorExists = await SimulatorService.checkIfSimulatorExistById(req.params.id);
        if (!simulatorExists) {
          return res.status(404).json({ error: "Simulator doesn't exist" });
        }

        if (req.body.deprecated == true) {
          var deprecateSimulator = await SimulatorService.setAsDeprecated(req.params.id);
          if (deprecateSimulator) {
            var simulator_created = await SimulatorService.createSimulator(simulatorFields);
            var simulator = await SimulatorService.returnCreatedOrUpdatedSimulator(simulator_created);
          }
        } else {
          var updatedSimulator = await SimulatorService.updateSimulator(req.params.id, simulatorFields);
          var simulator = await SimulatorService.returnCreatedOrUpdatedSimulator(updatedSimulator);
        }
        res.status(200).json(simulator);
      })();
    }
  },
  setSimulatorAsDeprecated: async function(req, res) {
    var canDeleteSimulator = await UserService.canCreateUpdateDeleteSimulator(req.user);
    if (!canDeleteSimulator) {
      return res.status(403).json({ message: "Forbidden" });
    }
    if (isNaN(req.params.id)) {
      return res.status(400).json({ error: "Simulator id is not valid number" });
    }

    var simulatorExists = await SimulatorService.getSimulatorById(req.params.id);
    if (!simulatorExists) {
      return res.status(400).json({ error: "Simulator doesn't exist" });
    }
    var deprecateSimulator = await SimulatorService.setAsDeprecated(req.params.id);
    if (deprecateSimulator) {
      res.status(200).json({ success: "Simulator set as deprecated" });
    } else {
      res.status(500).json({ error: "Something went wrong" });
    }
  },

  createSimulator: async function(req, res) {
    (async () => {
      var canCreateSimulator = await UserService.canCreateUpdateDeleteSimulator(req.user);
      if (!canCreateSimulator) {
        return res.status(403).json({ message: "Forbidden" });
      }
      const { errors, isValid } = validateSimulatorInput(req.body, true);

      // Check Validation
      if (!isValid) {
        return res.status(400).json(errors);
      }
      var simulatorFields = {};
      simulatorFields.title = req.body.title;
      if (req.body.resolution) {
        simulatorFields.resolution = req.body.resolution;
      }
      simulatorFields.os = req.body.os;

      if (req.body.dpi) {
        simulatorFields.dpi = req.body.dpi;
      }
      if (req.body.screen_size) {
        simulatorFields.screen_size = req.body.screen_size;
      }
      simulatorFields.retina = req.body.retina;

      if (typeof req.body.emulator === "string") {
        simulatorFields.emulator = req.body.emulator;
      }

      var created_simulator = await SimulatorService.createSimulator(simulatorFields);
      if (created_simulator) {
        var simulator = await SimulatorService.returnCreatedOrUpdatedSimulator(created_simulator);
        res.json(simulator);
      } else {
        res.status(500).json({ error: "An error occured while creating simulator" });
      }
    })();
  },

  getSimulatorById: async function(req, res) {
    var canGetSimulator = await UserService.canGetDeviceAndSimulator(req.user);
    if (!canGetSimulator) {
      return res.status(403).json({ message: "Forbidden" });
    }
    if (isNaN(req.params.id)) {
      return res.status(400).json({ error: "Simulator id is not valid number" });
    }
    if (req.params.id) {
      var simulatorExists = await SimulatorService.checkIfSimulatorExistById(req.params.id);
      if (!simulatorExists) {
        return res.status(404).json({ error: "Simulator doesn't exist" });
      }
    }
    var simulator = await SimulatorService.getSimulatorById(req.params.id);
    if (simulator) {
      return res.status(200).json(simulator);
    } else {
      return res.status(500).json({ error: "Something went wrong" });
    }
  }
};
