const Sequelize = require("sequelize");
const pgURI = require("../config/keys").postgresURI;
const sequelize = new Sequelize(pgURI);
const Op = Sequelize.Op;
const EnvironmentService = require("../services/environment");
const UserService = require("../services/user");
const ProjectService = require("../services/project");

const validateGetEnvironments = require("../validation/environment").validateGetEnvironments;
const validateEnvironmentInput = require("../validation/environment").validateEnvironmentInput;

module.exports = {
  getAllEnvironments: async function(req, res) {
    const { errors, isValid } = validateGetEnvironments(req.query, req.body);
    // Check Validation
    if (!isValid) {
      return res.status(400).json(errors);
    }
    var project_exists = await ProjectService.checkIfProjectExist(req.body.project_id);
    if (!project_exists) {
      return res.status(404).json({ error: "Project doesn't exist" });
    }

    var canGetEnvironments = await UserService.canGetEnvironments(req.user, req.body.project_id);
    if (!canGetEnvironments) {
      return res.status(403).json({ message: "Forbidden" });
    }
    if (req.query.page >= 0 && req.query.page_size) {
      var environments = await EnvironmentService.getAllEnvironmentsPaginated(
        req.body.project_id,
        req.query.page,
        req.query.page_size
      );
    } else {
      var environments = await EnvironmentService.getAllEnvironments(req.body.project_id);
    }
    if (environments) {
      return res.status(200).json(environments);
    } else {
      return res.status(500).json({ error: "Something went wrong" });
    }
  },
  getEnvironment: async function(req, res) {
    if (isNaN(req.params.id)) {
      return res.status(400).json({ error: "Environment id is not a valid number" });
    }
    var env_project = await EnvironmentService.getEnvironmentProject(req.params.id);
    var canGetEnvironments = await UserService.canGetEnvironments(req.user, env_project.project_id);
    if (!canGetEnvironments) {
      return res.status(403).json({ message: "Forbidden" });
    }

    var environment = await EnvironmentService.getEnvironmentById(req.params.id);
    if (environment) {
      return res.status(200).json(environment);
    } else {
      return res.status(404).json({ error: "Environment doesn't exist" });
    }
  },
  createEnvironment: async function(req, res) {
    (async () => {
      const { errors, isValid } = validateEnvironmentInput(req.body, true);

      // Check Validation
      if (!isValid) {
        return res.status(400).json(errors);
      }
      var project_exists = await ProjectService.checkIfProjectExist(req.body.project_id);
      if (!project_exists) {
        return res.status(404).json({ error: "Project doesn't exist" });
      }
      var canCreateEnvironment = await UserService.canCreateEditEnvironments(req.user, req.body.project_id);
      if (!canCreateEnvironment) {
        return res.status(403).json({ message: "Forbidden" });
      }

      var envFields = {};
      envFields.title = req.body.title;
      envFields.project_id = req.body.project_id;

      if (typeof req.body.used === "boolean") {
        envFields.used = req.body.used;
      }

      var created_environment = await EnvironmentService.createEnvironment(envFields);
      if (created_environment) {
        var environment = await EnvironmentService.returnCreatedOrUpdatedEnvironment(created_environment);
        res.json(environment);
      } else {
        res.status(500).json({ error: "An error occured while creating environment" });
      }
    })();
  },
  updateEnvironment: async function(req, res) {
    if (isNaN(req.params.id)) {
      return res.status(400).json({ error: "Environment id is not valid number" });
    } else {
      const { errors, isValid } = validateEnvironmentInput(req.body, false);
      // Check Validation
      if (!isValid) {
        return res.status(400).json(errors);
      }
      var env_project = await EnvironmentService.getEnvironmentProject(req.params.id);

      var canUpdateEnvironment = await UserService.canCreateEditEnvironments(req.user, env_project.project_id);
      if (!canUpdateEnvironment) {
        return res.status(403).json({ message: "Forbidden" });
      }
      var environmentExists = await EnvironmentService.getEnvironmentById(req.params.id);
      if (!environmentExists) {
        return res.status(400).json({ error: "Environment doesn't exist" });
      }

      var envFields = {};
      envFields.title = req.body.title;

      if (req.body.deprecated) {
        envFields.project_id = env_project.project_id;
      }

      if (req.body.deprecated == true) {
        var deprecateEnvironment = await EnvironmentService.setAsDeprecated(req.params.id);
        if (deprecateEnvironment) {
          var environment = await EnvironmentService.createEnvironment(envFields);
        }
      } else {
        var updatedEnvironment = await EnvironmentService.updateEnvironment(req.params.id, envFields);
        var environment = await EnvironmentService.returnCreatedOrUpdatedEnvironment(updatedEnvironment);
      }
      res.status(200).json(environment);
    }
  },
  setEnvironmentAsDeprecated: async function(req, res) {
    if (isNaN(req.params.id)) {
      return res.status(400).json({ error: "Environment id is not valid number" });
    }
    var env_project = await EnvironmentService.getEnvironmentProject(req.params.id);

    var canUpdateEnvironment = await UserService.canCreateEditEnvironments(req.user, env_project.project_id);
    if (!canUpdateEnvironment) {
      return res.status(403).json({ message: "Forbidden" });
    }
    var environmentExists = await EnvironmentService.getEnvironmentById(req.params.id);
    if (!environmentExists) {
      return res.status(400).json({ error: "Environment doesn't exist" });
    }
    var deprecateEnvironment = await EnvironmentService.setAsDeprecated(req.params.id);
    if (deprecateEnvironment) {
      res.status(200).json({ success: "Environment set as deprecated" });
    } else {
      res.status(500).json({ error: "Something went wrong" });
    }
  },
  seEnvironmentIsUsed: async function(req, res) {
    if (isNaN(req.params.id)) {
      return res.status(400).json({ error: "Environment id is not valid number" });
    }
    var env_project = await EnvironmentService.getEnvironmentProject(req.params.id);

    var canUpdateEnvironment = await UserService.canCreateEditEnvironments(req.user, env_project.project_id);
    if (!canUpdateEnvironment) {
      return res.status(403).json({ message: "Forbidden" });
    }
    var envExists = await EnvironmentService.getEnvironmentById(req.params.id);
    if (!envExists) {
      return res.status(400).json({ error: "Environment doesn't exist" });
    }

    if (req.query.used !== "true" && req.query.used !== "false") {
      return res.status(400).json({ error: "Parameter 'used' must have a true or false value" });
    }

    var setIsUsed = await EnvironmentService.setAsUsed(req.params.id, req.query.used);
    if (setIsUsed) {
      if (req.query.used == "true") {
        res.status(200).json({ success: "Environment set as used on project" });
      } else {
        res.status(200).json({ success: "Environment set as not used on project" });
      }
    } else {
      res.status(500).json({ error: "Something went wrong" });
    }
  }
};
