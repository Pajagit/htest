const Sequelize = require("sequelize");
const pgURI = require("../config/keys").postgresURI;
const sequelize = new Sequelize(pgURI);
const Op = Sequelize.Op;
const VersionService = require("../services/version");
const UserService = require("../services/user");
const ProjectService = require("../services/project");

const validateGetVersions = require("../validation/version").validateGetVersions;
const validateVersionInput = require("../validation/version").validateVersionInput;

module.exports = {
  getAllVersions: async function(req, res) {
    const { errors, isValid } = validateGetVersions(req.query);
    // Check Validation
    if (!isValid) {
      return res.status(400).json(errors);
    }
    var project_exists = await ProjectService.checkIfProjectExist(req.query.project_id);
    if (!project_exists) {
      return res.status(404).json({ error: "Project doesn't exist" });
    }

    var canGetVersions = await UserService.canGetVersions(req.user, req.query.project_id);
    if (!canGetVersions) {
      return res.status(403).json({ message: "Forbidden" });
    }
    if (req.query.page >= 0 && req.query.page_size) {
      var versions = await VersionService.getAllVersionsPaginated(
        req.query.project_id,
        req.query.page,
        req.query.page_size
      );
    } else {
      var versions = await VersionService.getAllVersions(req.query.project_id);
    }
    if (versions) {
      return res.status(200).json(versions);
    } else {
      return res.status(500).json({ error: "Something went wrong" });
    }
  },
  getVersion: async function(req, res) {
    if (isNaN(req.params.id)) {
      return res.status(400).json({ error: "Version id is not a valid number" });
    }
    var version_project = await VersionService.getVersionProject(req.params.id);
    var canGetVersions = await UserService.canGetVersions(req.user, version_project.project_id);
    if (!canGetVersions) {
      return res.status(403).json({ message: "Forbidden" });
    }

    var version = await VersionService.getVersionById(req.params.id);
    if (version) {
      return res.status(200).json(version);
    } else {
      return res.status(404).json({ error: "Version doesn't exist" });
    }
  },
  createVersion: async function(req, res) {
    (async () => {
      const { errors, isValid } = validateVersionInput(req.body, true);

      // Check Validation
      if (!isValid) {
        return res.status(400).json(errors);
      }
      var project_exists = await ProjectService.checkIfProjectExist(req.body.project_id);
      if (!project_exists) {
        return res.status(404).json({ error: "Project doesn't exist" });
      }
      var canCreateVersion = await UserService.canCreateEditVersions(req.user, req.body.project_id);
      if (!canCreateVersion) {
        return res.status(403).json({ message: "Forbidden" });
      }

      var versionFields = {};
      versionFields.version = req.body.version;
      versionFields.project_id = req.body.project_id;

      versionFields.is_supported = req.body.is_supported;

      if (req.body.support_stopped_at) {
        versionFields.support_stopped_at = req.body.support_stopped_at;
      }

      var created_version = await VersionService.createVersion(versionFields);
      if (created_version) {
        var version = await VersionService.returnCreatedOrUpdatedVersion(created_version);
        res.json(version);
      } else {
        res.status(500).json({ error: "An error occured while creating version" });
      }
    })();
  },
  updateVersion: async function(req, res) {
    if (isNaN(req.params.id)) {
      return res.status(400).json({ error: "Version id is not valid number" });
    } else {
      const { errors, isValid } = validateVersionInput(req.body, false);
      // Check Validation
      if (!isValid) {
        return res.status(400).json(errors);
      }
      var version_project = await VersionService.getVersionProject(req.params.id);

      var canUpdateVersion = await UserService.canCreateEditVersions(req.user, version_project.project_id);
      if (!canUpdateVersion) {
        return res.status(403).json({ message: "Forbidden" });
      }
      var versionExists = await VersionService.getVersionById(req.params.id);
      if (!versionExists) {
        return res.status(400).json({ error: "Version doesn't exist" });
      }

      var versionFields = {};
      versionFields.version = req.body.version;

      versionFields.is_supported = req.body.is_supported;

      if (req.body.support_stopped_at) {
        versionFields.support_stopped_at = req.body.support_stopped_at;
      }

      var updatedVersion = await VersionService.updateVersion(req.params.id, versionFields);
      var version = await VersionService.returnCreatedOrUpdatedVersion(updatedVersion);
      res.status(200).json(version);
    }
  },
  deleteVersion: async function(req, res) {
    if (isNaN(req.params.id)) {
      return res.status(400).json({ error: "Version id is not a valid number" });
    }
    var version_project = await VersionService.getVersionProject(req.params.id);

    var canDeleteVersion = await UserService.canCreateEditVersions(req.user, version_project.project_id);
    if (!canDeleteVersion) {
      return res.status(403).json({ message: "Forbidden" });
    }
    var versionExists = await VersionService.getVersionById(req.params.id);
    if (!versionExists) {
      return res.status(404).json({ error: "Version doesn't exist" });
    }
    var deleteVersion = await VersionService.deleteVersion(req.params.id);
    if (deleteVersion) {
      return res.status(200).json({ success: "Version removed successfully" });
    } else {
      return res.status(500).json({ message: "Something went wrong" });
    }
  }
};
