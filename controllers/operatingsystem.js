const OsService = require("../services/operatingsystem");
const UserService = require("../services/user");
const ProjectService = require("../services/project");

const validateGetOss = require("../validation/os").validateGetOss;
const validateOSInput = require("../validation/os").validateOSInput;

module.exports = {
  getOperatingSystems: async function(req, res) {
    const { errors, isValid } = validateGetOss(req.query);
    // Check Validation
    if (!isValid) {
      return res.status(400).json(errors);
    }
    var project_exists = await ProjectService.checkIfProjectExist(req.query.project_id);
    if (!project_exists) {
      return res.status(404).json({ error: "Project doesn't exist" });
    }

    var canGetOS = await UserService.canGetOS(req.user, req.query.project_id);
    if (!canGetOS) {
      return res.status(403).json({ message: "Forbidden" });
    }
    if (req.query.page >= 0 && req.query.page_size) {
      var oss = await OsService.getAllOperatingSystemsPaginated(
        req.query.project_id,
        req.query.page,
        req.query.page_size
      );
    } else {
      var oss = await OsService.getAllOperatingSystems(req.query.project_id);
    }
    if (oss) {
      return res.status(200).json(oss);
    } else {
      return res.status(500).json({ error: "Something went wrong" });
    }
  },
  getOS: async function(req, res) {
    if (isNaN(req.params.id)) {
      return res.status(400).json({ error: "OS id is not a valid number" });
    }
    var os_project = await OsService.getOSProject(req.params.id);
    var canGetOS = await UserService.canGetOS(req.user, os_project.project_id);
    if (!canGetOS) {
      return res.status(403).json({ message: "Forbidden" });
    }

    var os = await OsService.getOSById(req.params.id);
    if (os) {
      return res.status(200).json(os);
    } else {
      return res.status(404).json({ error: "OS doesn't exist" });
    }
  },
  createOS: async function(req, res) {
    (async () => {
      const { errors, isValid } = validateOSInput(req.body, true);

      // Check Validation
      if (!isValid) {
        return res.status(400).json(errors);
      }
      var project_exists = await ProjectService.checkIfProjectExist(req.body.project_id);
      if (!project_exists) {
        return res.status(404).json({ error: "Project doesn't exist" });
      }
      var canCreateOS = await UserService.canCreateEditOS(req.user, req.body.project_id);
      if (!canCreateOS) {
        return res.status(403).json({ message: "Forbidden" });
      }

      var osFields = {};
      osFields.title = req.body.title;
      osFields.project_id = req.body.project_id;

      osFields.used = req.body.used;

      var created_os = await OsService.createOS(osFields);
      if (created_os) {
        var os = await OsService.returnCreatedOrUpdatedOS(created_os);
        res.json(os);
      } else {
        res.status(500).json({ error: "An error occured while creating OS" });
      }
    })();
  },
  updateOS: async function(req, res) {
    if (isNaN(req.params.id)) {
      return res.status(400).json({ error: "OS id is not valid number" });
    } else {
      const { errors, isValid } = validateOSInput(req.body, false);
      // Check Validation
      if (!isValid) {
        return res.status(400).json(errors);
      }
      var os_project = await OsService.getOSProject(req.params.id);

      var canUpdateOS = await UserService.canCreateEditOS(req.user, os_project.project_id);
      if (!canUpdateOS) {
        return res.status(403).json({ message: "Forbidden" });
      }
      var osExists = await OsService.getOSById(req.params.id);
      if (!osExists) {
        return res.status(400).json({ error: "OS doesn't exist" });
      }

      var osFields = {};
      osFields.title = req.body.title;

      if (req.body.deprecated) {
        osFields.project_id = os_project.project_id;
      }

      if (req.body.deprecated == true) {
        var deprecateOs = await OsService.setAsDeprecated(req.params.id);
        if (deprecateOs) {
          var os = await OsService.createOS(osFields);
        }
      } else {
        var updatedOs = await OsService.updateOS(req.params.id, osFields);
        var os = await OsService.returnCreatedOrUpdatedOS(updatedOs);
      }
      res.status(200).json(os);
    }
  },
  setOSAsDeprecated: async function(req, res) {
    if (isNaN(req.params.id)) {
      return res.status(400).json({ error: "OS id is not valid number" });
    }
    var os_project = await OsService.getOSProject(req.params.id);

    var canUpdateOs = await UserService.canCreateEditOS(req.user, os_project.project_id);
    if (!canUpdateOs) {
      return res.status(403).json({ message: "Forbidden" });
    }
    var osExists = await OsService.getOSById(req.params.id);
    if (!osExists) {
      return res.status(400).json({ error: "OS doesn't exist" });
    }
    var deprecateOs = await OsService.setAsDeprecated(req.params.id);
    if (deprecateOs) {
      var settings = await OsService.findAllOccurancesInReportSettings(req.params.id);
      if (settings) {
        for (var i = 0; i < settings.length; i++) {
          var newOss = Array();
          var limit = settings[i].operatingsystems.length - 1;
          for (var j = 0; j < settings[i].operatingsystems.length; j++) {
            if (settings[i].operatingsystems[j] != req.params.id) {
              newOss.push(settings[i].operatingsystems[j]);
            }
            if (j == limit) {
              var newSettings = await OsService.removeAllOccurancesInReportSettings(settings[i].id, newOss);
            }
          }
        }
      }
      res.status(200).json({ success: "OS set as deprecated" });
    } else {
      res.status(500).json({ error: "Something went wrong" });
    }
  },
  seOsIsUsed: async function(req, res) {
    if (isNaN(req.params.id)) {
      return res.status(400).json({ error: "OS id is not valid number" });
    }
    var os_project = await OsService.getOSProject(req.params.id);

    var canUpdateOs = await UserService.canCreateEditOS(req.user, os_project.project_id);
    if (!canUpdateOs) {
      return res.status(403).json({ message: "Forbidden" });
    }
    var osExists = await OsService.getOSById(req.params.id);
    if (!osExists) {
      return res.status(400).json({ error: "OS doesn't exist" });
    }

    if (req.query.used !== "true" && req.query.used !== "false") {
      return res.status(400).json({ error: "Parameter 'used' must have a true or false value" });
    }

    var setIsUsed = await OsService.setAsUsed(req.params.id, req.query.used);
    if (setIsUsed) {
      if (req.query.used == "true") {
        res.status(200).json({ success: "OS set as used on project" });
      } else {
        res.status(200).json({ success: "OS set as not used on project" });
      }
    } else {
      res.status(500).json({ error: "Something went wrong" });
    }
  }
};
