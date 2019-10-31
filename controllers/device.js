const Sequelize = require("sequelize");
const pgURI = require("../config/keys").postgresURI;
const sequelize = new Sequelize(pgURI);
const Op = Sequelize.Op;
const DeviceService = require("../services/device");
const OfficeService = require("../services/office");
const UserService = require("../services/user");
const OSService = require("../services/os");
const validateGetDevices = require("../validation/device").validateGetDevices;
const validateDeviceInput = require("../validation/device").validateDeviceInput;

module.exports = {
  getDevices: async function(req, res) {
    var canGetDevice = await UserService.canGetDeviceAndSimulator(req.user);
    if (!canGetDevice) {
      return res.status(403).json({ message: "Forbidden" });
    }
    const { errors, isValid } = validateGetDevices(req.query);

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
      var devices = await DeviceService.getDevicesPaginated(whereStatement, req.query.page, req.query.page_size);
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
      const { errors, isValid } = validateDeviceInput(req.body);

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
      const { errors, isValid } = validateDeviceInput(req.body);
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

        var updatedDevice = await DeviceService.updateDevice(req.params.id, deviceFields);
        var device = await DeviceService.returnCreatedOrUpdatedDevice(updatedDevice);
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
  createSimulator: async function(req, res) {
    (async () => {
      var canCreateSimulator = await UserService.canCreateUpdateDeleteSimulator(req.user);
      if (!canCreateSimulator) {
        return res.status(403).json({ message: "Forbidden" });
      }
      const { errors, isValid } = validateDeviceInput(req.body, false);

      // Check Validation
      if (!isValid) {
        return res.status(400).json(errors);
      }
      var deviceFields = {};
      deviceFields.title = req.body.title;
      if (req.body.resolution) {
        deviceFields.resolution = req.body.resolution;
      }
      deviceFields.os = req.body.os;

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

      deviceFields.simulator = true;

      var created_device = await DeviceService.createDevice(deviceFields);
      if (created_device) {
        var device = await DeviceService.returnCreatedOrUpdatedDevice(created_device);
        res.json(device);
      } else {
        res.status(500).json({ error: "An error occured while creating simulator" });
      }
    })();
  },
  updateSimulator: async function(req, res) {
    var canUpdateSimulator = await UserService.canCreateUpdateDeleteSimulator(req.user);
    if (!canUpdateSimulator) {
      return res.status(403).json({ message: "Forbidden" });
    }
    if (isNaN(req.params.id)) {
      return res.status(400).json({ error: "Simulator id is not valid number" });
    } else {
      const { errors, isValid } = validateDeviceInput(req.body, false);
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
      deviceFields.os = req.body.os;

      if (req.body.udid) {
        deviceFields.udid = req.body.udid;
      }
      if (req.body.screen_size) {
        deviceFields.screen_size = req.body.screen_size;
      }
      deviceFields.retina = req.body.retina;

      (async () => {
        var deviceExists = await DeviceService.checkIfDeviceExistById(req.params.id, false);
        if (!deviceExists) {
          return res.status(403).json({ error: "Simulator doesn't exist" });
        }

        var updatedDevice = await DeviceService.updateDevice(req.params.id, deviceFields);
        var device = await DeviceService.returnCreatedOrUpdatedDevice(updatedDevice);
        res.status(200).json(device);
      })();
    }
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
      var deviceExists = await DeviceService.checkIfDeviceExistById(req.params.id, false);
      if (!deviceExists) {
        return res.status(404).json({ error: "Simulator doesn't exist" });
      }
    }
    var device = await DeviceService.getDeviceById(req.params.id, false);
    if (device) {
      return res.status(200).json(device);
    } else {
      return res.status(500).json({ error: "Something went wrong" });
    }
  },
  deleteSimulator: async function(req, res) {
    var canDeleteSimulator = await UserService.canCreateUpdateDeleteSimulator(req.user);
    if (!canDeleteSimulator) {
      return res.status(403).json({ message: "Forbidden" });
    }
    var deviceExists = await DeviceService.checkIfDeviceExistById(req.params.id, false);
    if (!deviceExists) {
      return res.status(404).json({ error: "Simulator doesn't exist" });
    }
    var deleteDevice = await DeviceService.deleteDevice(req.params.id);
    if (deleteDevice) {
      return res.status(200).json({ success: "Simulator removed successfully" });
    } else {
      return res.status(500).json({ message: "Something went wrong" });
    }
  }
};
