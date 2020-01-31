const Sequelize = require("sequelize");
const pgURI = require("../config/keys").postgresURI;
const sequelize = new Sequelize(pgURI);
const Op = Sequelize.Op;
const SimulatorService = require("../services/simulator");
const UserService = require("../services/user");
const ProjectService = require("../services/project");
const validateGetSimulator = require("../validation/simulator").validateGetSimulator;
const validateSimulatorInput = require("../validation/simulator").validateSimulatorInput;

module.exports = {
  getSimulators: async function(req, res) {
    var canGetSimulator = await UserService.canGetDeviceAndSimulator(req.user);
    if (!canGetSimulator) {
      return res.status(403).json({ message: "Forbidden" });
    }
    const { errors, isValid } = validateGetSimulator(req.query, req.body);

    // Check Validation
    if (!isValid) {
      return res.status(400).json(errors);
    }

    var project_exists = await ProjectService.checkIfProjectExist(req.body.project_id);
    if (!project_exists) {
      return res.status(404).json({ error: "Project doesn't exist" });
    }

    var whereStatement = {};
    whereStatement.deprecated = false;

    if (typeof req.body.emulator === "boolean") {
      whereStatement.emulator = req.body.emulator;
    }
    whereStatement.deprecated = false;

    whereStatement.project_id = req.body.project_id;
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
    if (isNaN(req.params.id)) {
      return res.status(400).json({ error: "Simulator id is not valid number" });
    } else {
      const { errors, isValid } = validateSimulatorInput(req.body, false);
      // Check Validation
      if (!isValid) {
        return res.status(400).json(errors);
      }

      var simulatorProject = await SimulatorService.getSimulatorProject(req.params.id);
      var canUpdateSimulator = await UserService.canCreateUpdateDeleteSimulator(req.user, simulatorProject.project_id);
      if (!canUpdateSimulator) {
        return res.status(403).json({ message: "Forbidden" });
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

      if (typeof req.body.emulator === "boolean") {
        simulatorFields.emulator = req.body.emulator;
      }
      (async () => {
        var simulatorExists = await SimulatorService.checkIfSimulatorExistById(req.params.id);
        if (!simulatorExists) {
          return res.status(404).json({ error: "Simulator doesn't exist" });
        }

        var updatedSimulator = await SimulatorService.updateSimulator(req.params.id, simulatorFields);
        var simulator = await SimulatorService.returnCreatedOrUpdatedSimulator(updatedSimulator);

        res.status(200).json(simulator);
      })();
    }
  },
  setSimulatorAsDeprecated: async function(req, res) {
    var simulatorProject = await SimulatorService.getSimulatorProject(req.params.id);
    var canDeleteSimulator = await UserService.canCreateUpdateDeleteSimulator(req.user, simulatorProject.project_id);
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
      const { errors, isValid } = validateSimulatorInput(req.body, true);

      // Check Validation
      if (!isValid) {
        return res.status(400).json(errors);
      }

      var project_exists = await ProjectService.checkIfProjectExist(req.body.project_id);
      if (!project_exists) {
        return res.status(404).json({ error: "Project doesn't exist" });
      }

      var canCreateSimulator = await UserService.canCreateUpdateDeleteSimulator(req.user, req.body.project_id);
      if (!canCreateSimulator) {
        return res.status(403).json({ message: "Forbidden" });
      }

      var simulatorFields = {};
      simulatorFields.project_id = req.body.project_id;

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

      if (typeof req.body.emulator === "boolean") {
        simulatorFields.emulator = req.body.emulator;
      }

      if (typeof req.body.used === "boolean") {
        simulatorFields.used = req.body.used;
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
  },

  setSimulatorIsUsed: async function(req, res) {
    if (isNaN(req.params.id)) {
      return res.status(400).json({ error: "Simulator id is not valid number" });
    }
    var simulator_project = await SimulatorService.getSimulatorProject(req.params.id);

    var canUpdateSimulator = await UserService.canCreateUpdateDeleteSimulator(req.user, simulator_project.project_id);
    if (!canUpdateSimulator) {
      return res.status(403).json({ message: "Forbidden" });
    }
    var simulatorExists = await SimulatorService.getSimulatorById(req.params.id);
    if (!simulatorExists) {
      return res.status(400).json({ error: "Simulator doesn't exist" });
    }

    if (req.query.used !== "true" && req.query.used !== "false") {
      return res.status(400).json({ error: "Parameter 'used' must have a true or false value" });
    }

    var setIsUsed = await SimulatorService.setAsUsed(req.params.id, req.query.used);
    if (setIsUsed) {
      if (req.query.used == "true") {
        res.status(200).json({ success: "Simulator set as used on project" });
      } else {
        res.status(200).json({ success: "Simulator set as not used on project" });
      }
    } else {
      res.status(500).json({ error: "Something went wrong" });
    }
  }
};
