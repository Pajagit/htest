const Sequelize = require("sequelize");
const pgURI = require("../config/keys").postgresURI;
const sequelize = new Sequelize(pgURI);
const Op = Sequelize.Op;
const DeviceService = require("../services/device");
const OfficeService = require("../services/office");
const UserService = require("../services/user");
const ProjectService = require("../services/project");
const validateGetDevices = require("../validation/device").validateGetDevices;
const validateDeviceInput = require("../validation/device").validateDeviceInput;

module.exports = {
  getDevices: async function(req, res) {
    var canGetDevice = await UserService.canGetDeviceAndSimulator(req.user);
    if (!canGetDevice) {
      return res.status(403).json({ message: "Forbidden" });
    }
    const { errors, isValid } = validateGetDevices(req.query, req.body);

    // Check Validation
    if (!isValid) {
      return res.status(400).json(errors);
    }

    var whereStatement = {};
    whereStatement.deprecated = false;
    if (req.body.offices) {
      if (req.body.offices.length > 0) {
        whereStatement.office_id = {
          [Op.in]: req.body.offices
        };
      }
    }

    if (req.query.page >= 0 && req.query.page_size) {
      var devices = await DeviceService.getDevicesPaginated(
        whereStatement,
        req.query.page,
        req.query.page_size,
        req.body.project_id
      );
    } else {
      var devices = await DeviceService.getAllDevices(whereStatement);
    }
    if (devices) {
      return res.status(200).json(devices);
    } else {
      return res.status(500).json({ error: "Something went wrong" });
    }
  },
  createDevice: async function(req, res) {
    (async () => {
      var canCreateDevice = await UserService.canCreateUpdateDeleteDevice(req.user);
      if (!canCreateDevice) {
        return res.status(403).json({ message: "Forbidden" });
      }
      const { errors, isValid } = validateDeviceInput(req.body, true);

      // Check Validation
      if (!isValid) {
        return res.status(400).json(errors);
      }
      var deviceFields = {};
      deviceFields.title = req.body.title;
      if (req.body.resolution) {
        deviceFields.resolution = req.body.resolution;
      }
      if (req.body.dpi) {
        deviceFields.dpi = req.body.dpi;
      }
      if (req.body.udid) {
        deviceFields.udid = req.body.udid;
      }
      if (req.body.screen_size) {
        deviceFields.screen_size = req.body.screen_size;
      }
      deviceFields.retina = req.body.retina;
      deviceFields.os = req.body.os;

      if (req.body.office_id) {
        deviceFields.office_id = req.body.office_id;
      }

      var office_exists = await OfficeService.checkIfOfficeExists(req.body.office_id);

      if (!office_exists) {
        return res.status(400).json({ error: "Office doesn't exist" });
      }

      var created_device = await DeviceService.createDevice(deviceFields);
      if (created_device) {
        var device = await DeviceService.returnCreatedOrUpdatedDevice(created_device);
        res.json(device);
      } else {
        res.status(500).json({ error: "An error occured while creating device" });
      }
    })();
  },
  updateDevice: async function(req, res) {
    var canUpdateDevice = await UserService.canCreateUpdateDeleteDevice(req.user);
    if (!canUpdateDevice) {
      return res.status(403).json({ message: "Forbidden" });
    }
    if (isNaN(req.params.id)) {
      return res.status(400).json({ error: "Device id is not valid number" });
    } else {
      const { errors, isValid } = validateDeviceInput(req.body, false);
      // Check Validation
      if (!isValid) {
        return res.status(400).json(errors);
      }

      if (req.body.office_id) {
        var office_exists = await OfficeService.checkIfOfficeExists(req.body.office_id);
      }
      if (!office_exists) {
        return res.status(400).json({ error: "Office doesn't exist" });
      }

      var deviceFields = {};
      deviceFields.title = req.body.title;
      if (req.body.resolution) {
        deviceFields.resolution = req.body.resolution;
      }
      if (req.body.dpi) {
        deviceFields.dpi = req.body.dpi;
      }
      if (req.body.udid) {
        deviceFields.udid = req.body.udid;
      }
      if (req.body.screen_size) {
        deviceFields.screen_size = req.body.screen_size;
      }
      deviceFields.retina = req.body.retina;
      deviceFields.os = req.body.os;

      if (req.body.office_id) {
        deviceFields.office_id = req.body.office_id;
      }

      (async () => {
        var deviceExists = await DeviceService.checkIfDeviceExistById(req.params.id);
        if (!deviceExists) {
          return res.status(404).json({ error: "Device doesn't exist" });
        }

        var deprecateDevice = await DeviceService.setAsDeprecated(req.params.id);
        if (deprecateDevice) {
          var device_created = await DeviceService.createDevice(deviceFields);
          var device = await DeviceService.returnCreatedOrUpdatedDevice(device_created);
          var usedOnProjects = await DeviceService.checkIfUsedOnAnyProject(req.params.id);
          if (usedOnProjects) {
            await DeviceService.updateProjectDevices(req.params.id, device);
          }
        }

        res.status(200).json(device);
      })();
    }
  },
  setDeviceAsDeprecated: async function(req, res) {
    var canDeleteDevice = await UserService.canCreateUpdateDeleteDevice(req.user);
    if (!canDeleteDevice) {
      return res.status(403).json({ message: "Forbidden" });
    }
    if (isNaN(req.params.id)) {
      return res.status(400).json({ error: "Device id is not valid number" });
    }

    var deviceExists = await DeviceService.getDeviceById(req.params.id);
    if (!deviceExists) {
      return res.status(400).json({ error: "Device doesn't exist" });
    }
    var deprecateDevice = await DeviceService.setAsDeprecated(req.params.id);
    var usedOnProjects = await DeviceService.checkIfUsedOnAnyProject(req.params.id);
    if (usedOnProjects) {
      await DeviceService.removeFromProjects(req.params.id);
    }
    if (deprecateDevice) {
      res.status(200).json({ success: "Device set as deprecated" });
    } else {
      res.status(500).json({ error: "Something went wrong" });
    }
  },
  getDeviceById: async function(req, res) {
    var canGetDevice = await UserService.canGetDeviceAndSimulator(req.user);
    if (!canGetDevice) {
      return res.status(403).json({ message: "Forbidden" });
    }
    if (isNaN(req.params.id)) {
      return res.status(400).json({ error: "Device id is not valid number" });
    }
    if (req.params.id) {
      var deviceExists = await DeviceService.checkIfDeviceExistById(req.params.id, true);
      if (!deviceExists) {
        return res.status(404).json({ error: "Device doesn't exist" });
      }
    }
    var device = await DeviceService.getDeviceById(req.params.id, true);
    if (device) {
      return res.status(200).json(device);
    } else {
      return res.status(500).json({ error: "Something went wrong" });
    }
  },
  setDeviceIsUsed: async function(req, res) {
    var canSetDeviceIsUsed = await UserService.canCreateUpdateDeleteDevice(req.user);
    if (!canSetDeviceIsUsed) {
      return res.status(403).json({ message: "Forbidden" });
    }
    if (isNaN(req.params.id)) {
      return res.status(400).json({ error: "Device id is not valid number" });
    }
    if (!req.query.project_id) {
      return res.status(400).json({ error: "Project id is required" });
    } else {
      if (isNaN(req.query.project_id)) {
        return res.status(400).json({ error: "Project id is not valid number" });
      }
    }
    if (req.params.id) {
      var deviceExists = await DeviceService.checkIfDeviceExistById(req.params.id, true);
      if (!deviceExists) {
        return res.status(404).json({ error: "Device doesn't exist" });
      }
    }
    if (req.query.project_id) {
      var projectExists = await ProjectService.checkIfProjectExist(req.query.project_id);
      if (!projectExists) {
        return res.status(404).json({ error: "Project doesn't exist" });
      }
    }
    if (req.query.used !== "true" && req.query.used !== "false") {
      return res.status(400).json({ error: "Parameter 'used' must have a true or false value" });
    }

    var used = await DeviceService.checkIfUsed(req.params.id, req.query.project_id);

    if ((used && req.query.used === "false") || (!used && req.query.used === "true")) {
      device_used = await DeviceService.setIsUsed(req.params.id, req.query.project_id, req.query.used);
      if (device_used) {
        if (req.query.used === "true") {
          res.status(200).json({ success: "Device set as used on project" });
        } else {
          res.status(200).json({ success: "Device set as not used on project" });
        }
      } else {
        res.status(500).json({ error: "Something went wrong" });
      }
    } else {
      if (req.query.used === "true") {
        res.status(200).json({ success: "Device has already been set as used on project" });
      } else {
        res.status(200).json({ success: "Device has already been set as not used on project" });
      }
    }
  }
};
