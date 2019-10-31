const Sequelize = require("sequelize");
const pgURI = require("../config/keys").postgresURI;
const sequelize = new Sequelize(pgURI);
const Op = Sequelize.Op;
const BrowserService = require("../services/browser");
const UserService = require("../services/user");
const ProjectService = require("../services/project");

const validateGetBrowsers = require("../validation/browser").validateGetBrowsers;
const validateBrowserInput = require("../validation/browser").validateBrowserInput;

module.exports = {
  getAllBrowsers: async function(req, res) {
    const { errors, isValid } = validateGetBrowsers(req.query);
    // Check Validation
    if (!isValid) {
      return res.status(400).json(errors);
    }

    var project_exists = await ProjectService.checkIfProjectExist(req.query.project_id);
    if (!project_exists) {
      return res.status(404).json({ error: "Project doesn't exist" });
    }

    var canGetBrowsers = await UserService.canGetBrowsers(req.user, req.query.project_id);
    if (!canGetBrowsers) {
      return res.status(403).json({ message: "Forbidden" });
    }

    if (req.query.page >= 0 && req.query.page_size) {
      var browsers = await BrowserService.getAllBrowsersPaginated(
        req.query.project_id,
        req.query.page,
        req.query.page_size
      );
    } else {
      var browsers = await BrowserService.getAllBrowsers(req.query.project_id);
    }
    if (browsers) {
      return res.status(200).json(browsers);
    } else {
      return res.status(500).json({ error: "Something went wrong" });
    }
  },
  getBrowser: async function(req, res) {
    if (isNaN(req.params.id)) {
      return res.status(400).json({ error: "Browser id is not a valid number" });
    }
    var browser_project = await BrowserService.getBrowserProject(req.params.id);
    var canGetBrowsers = await UserService.canGetBrowsers(req.user, browser_project.project_id);
    if (!canGetBrowsers) {
      return res.status(403).json({ message: "Forbidden" });
    }

    var browser = await BrowserService.getBrowserById(req.params.id);
    if (browser) {
      return res.status(200).json(browser);
    } else {
      return res.status(404).json({ error: "Browser doesn't exist" });
    }
  },
  createBrowser: async function(req, res) {
    (async () => {
      const { errors, isValid } = validateBrowserInput(req.body, true);

      // Check Validation
      if (!isValid) {
        return res.status(400).json(errors);
      }
      var project_exists = await ProjectService.checkIfProjectExist(req.body.project_id);
      if (!project_exists) {
        return res.status(404).json({ error: "Project doesn't exist" });
      }
      var canCreateBrowser = await UserService.canCreateEditBrowsers(req.user, req.body.project_id);
      if (!canCreateBrowser) {
        return res.status(403).json({ message: "Forbidden" });
      }

      var browserFields = {};
      browserFields.title = req.body.title;
      if (req.body.screen_resolution) {
        browserFields.screen_resolution = req.body.screen_resolution;
      }
      if (req.body.version) {
        browserFields.version = req.body.version;
      }
      if (typeof req.body.used === "boolean") {
        browserFields.used = req.body.used;
      }
      browserFields.project_id = req.body.project_id;

      var created_browser = await BrowserService.createBrowser(browserFields);
      if (created_browser) {
        var browser = await BrowserService.returnCreatedOrUpdatedBrowser(created_browser);
        res.json(browser);
      } else {
        res.status(500).json({ error: "An error occured while creating browser" });
      }
    })();
  },
  updateBrowser: async function(req, res) {
    if (isNaN(req.params.id)) {
      return res.status(400).json({ error: "Browser id is not valid number" });
    } else {
      const { errors, isValid } = validateBrowserInput(req.body, false);
      // Check Validation
      if (!isValid) {
        return res.status(400).json(errors);
      }
      var browser_project = await BrowserService.getBrowserProject(req.params.id);

      var canUpdateBrowser = await UserService.canCreateEditBrowsers(req.user, browser_project.project_id);
      if (!canUpdateBrowser) {
        return res.status(403).json({ message: "Forbidden" });
      }
      var browserExists = await BrowserService.getBrowserById(req.params.id);
      if (!browserExists) {
        return res.status(400).json({ error: "Browser doesn't exist" });
      }

      var browserFields = {};
      browserFields.title = req.body.title;
      if (req.body.screen_resolution) {
        browserFields.screen_resolution = req.body.screen_resolution;
      }
      if (req.body.version) {
        browserFields.version = req.body.version;
      }

      if (req.body.deprecated) {
        browserFields.project_id = browser_project.project_id;
      }

      if (req.body.deprecated == true) {
        var deprecateBrowser = await BrowserService.setAsDeprecated(req.params.id);
        if (deprecateBrowser) {
          var browser = await BrowserService.createBrowser(browserFields);
        }
      } else {
        var updatedBrowser = await BrowserService.updateBrowser(req.params.id, browserFields);
        var browser = await BrowserService.returnCreatedOrUpdatedBrowser(updatedBrowser);
      }
      res.status(200).json(browser);
    }
  },
  setBrowserAsDeprecated: async function(req, res) {
    if (isNaN(req.params.id)) {
      return res.status(400).json({ error: "Browser id is not valid number" });
    }
    var browser_project = await BrowserService.getBrowserProject(req.params.id);

    var canUpdateBrowser = await UserService.canCreateEditBrowsers(req.user, browser_project.project_id);
    if (!canUpdateBrowser) {
      return res.status(403).json({ message: "Forbidden" });
    }
    var browserExists = await BrowserService.getBrowserById(req.params.id);
    if (!browserExists) {
      return res.status(400).json({ error: "Browser doesn't exist" });
    }
    var deprecateBrowser = await BrowserService.setAsDeprecated(req.params.id);
    if (deprecateBrowser) {
      res.status(200).json({ success: "Browser set as deprecated" });
    } else {
      res.status(500).json({ error: "Something went wrong" });
    }
  },
  setBrowserIsUsed: async function(req, res) {
    if (isNaN(req.params.id)) {
      return res.status(400).json({ error: "Browser id is not valid number" });
    }
    var browser_project = await BrowserService.getBrowserProject(req.params.id);

    var canUpdateBrowser = await UserService.canCreateEditBrowsers(req.user, browser_project.project_id);
    if (!canUpdateBrowser) {
      return res.status(403).json({ message: "Forbidden" });
    }
    var browserExists = await BrowserService.getBrowserById(req.params.id);
    if (!browserExists) {
      return res.status(400).json({ error: "Browser doesn't exist" });
    }

    if (req.query.used !== "true" && req.query.used !== "false") {
      return res.status(400).json({ error: "Parameter 'used' must have a true or false value" });
    }

    var setIsUsed = await BrowserService.setAsUsed(req.params.id, req.query.used);
    if (setIsUsed) {
      if (req.query.used == "true") {
        res.status(200).json({ success: "Browser set as used on project" });
      } else {
        res.status(200).json({ success: "Browser set as not used on project" });
      }
    } else {
      res.status(500).json({ error: "Something went wrong" });
    }
  }
};
