const Sequelize = require("sequelize");
const pgURI = require("../config/keys").postgresURI;
const sequelize = new Sequelize(pgURI);
const Op = Sequelize.Op;
const BrowserService = require("../services/browser");
const UserService = require("../services/user");

const validateGetBrowsers = require("../validation/browser").validateGetBrowsers;
const validateBrowserInput = require("../validation/browser").validateBrowserInput;

module.exports = {
  getAllBrowsers: async function(req, res) {
    var canGetBrowsers = await UserService.canGetBrowsers(req.user);
    if (!canGetBrowsers) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const { errors, isValid } = validateGetBrowsers(req.query);

    // Check Validation
    if (!isValid) {
      return res.status(400).json(errors);
    }

    if (req.query.page >= 0 && req.query.page_size) {
      var browsers = await BrowserService.getAllBrowsersPaginated(req.query.page, req.query.page_size);
    } else {
      var browsers = await BrowserService.getAllBrowsers();
    }
    if (browsers) {
      return res.status(200).json(browsers);
    } else {
      return res.status(500).json({ error: "Something went wrong" });
    }
  },
  getBrowser: async function(req, res) {
    var canGetBrowsers = await UserService.canGetBrowsers(req.user);
    if (!canGetBrowsers) {
      return res.status(403).json({ message: "Forbidden" });
    }

    if (isNaN(req.params.id)) {
      return res.status(400).json({ error: "Browser id is not a valid number" });
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
      var canCreateBrowser = await UserService.canCreateEditBrowsers(req.user);
      if (!canCreateBrowser) {
        return res.status(403).json({ message: "Forbidden" });
      }
      const { errors, isValid } = validateBrowserInput(req.body);

      // Check Validation
      if (!isValid) {
        return res.status(400).json(errors);
      }
      var browserExists = await BrowserService.checkIfBrowserExist(req.body);
      if (browserExists) {
        return res.status(400).json({ error: "Browser alredy exist" });
      }
      var browserFields = {};
      browserFields.title = req.body.title;
      if (req.body.screen_resolution) {
        browserFields.screen_resolution = req.body.screen_resolution;
      }
      if (req.body.version) {
        browserFields.version = req.body.version;
      }

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
    var canUpdateBrowser = await UserService.canCreateEditBrowsers(req.user);
    if (!canUpdateBrowser) {
      return res.status(403).json({ message: "Forbidden" });
    }
    if (isNaN(req.params.id)) {
      return res.status(400).json({ error: "Browser id is not valid number" });
    } else {
      const { errors, isValid } = validateBrowserInput(req.body);
      // Check Validation
      if (!isValid) {
        return res.status(400).json(errors);
      }
      var browserExists = await BrowserService.getBrowserById(req.params.id);
      if (!browserExists) {
        return res.status(400).json({ error: "Browser doesn't exist" });
      }
      var sameBrowserExists = await BrowserService.checkIfSameBrowserExist(req.body, req.params.id);
      if (sameBrowserExists) {
        return res.status(400).json({ error: "Browser with same details already exist" });
      }

      var browserFields = {};
      browserFields.title = req.body.title;
      if (req.body.screen_resolution) {
        browserFields.screen_resolution = req.body.screen_resolution;
      }
      if (req.body.version) {
        browserFields.version = req.body.version;
      }

      var updatedBrowser = await BrowserService.updateBrowser(req.params.id, browserFields);
      var browser = await BrowserService.returnCreatedOrUpdatedBrowser(updatedBrowser);
      res.status(200).json(browser);
    }
  }
};
