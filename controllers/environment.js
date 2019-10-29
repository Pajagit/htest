const Sequelize = require("sequelize");
const pgURI = require("../config/keys").postgresURI;
const sequelize = new Sequelize(pgURI);
const Op = Sequelize.Op;
const EnvironmentService = require("../services/environment");
const UserService = require("../services/user");
const ProjectService = require("../services/project");

const validateGetEnvironments = require("../validation/environment").validateGetEnvironments;
// const validateVersionInput = require("../validation/version").validateVersionInput;

module.exports = {
  getAllEnvironments: async function(req, res) {
    const { errors, isValid } = validateGetEnvironments(req.query);
    // Check Validation
    if (!isValid) {
      return res.status(400).json(errors);
    }
    var project_exists = await ProjectService.checkIfProjectExist(req.query.project_id);
    if (!project_exists) {
      return res.status(404).json({ error: "Project doesn't exist" });
    }

    var canGetEnvironments = await UserService.canGetEnvironments(req.user, req.query.project_id);
    if (!canGetEnvironments) {
      return res.status(403).json({ message: "Forbidden" });
    }
    if (req.query.page >= 0 && req.query.page_size) {
      var environments = await EnvironmentService.getAllEnvironmentsPaginated(
        req.query.project_id,
        req.query.page,
        req.query.page_size
      );
    } else {
      var environments = await EnvironmentService.getAllEnvironments(req.query.project_id);
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
  }
};
