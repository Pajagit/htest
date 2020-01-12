const Sequelize = require("sequelize");
const pgURI = require("../config/keys").postgresURI;
const sequelize = new Sequelize(pgURI);
const Op = Sequelize.Op;
const TestSetupService = require("../services/testsetup");
const ProjectService = require("../services/project");
const UserService = require("../services/user");

const validateGetTestSetup = require("../validation/testsetup").validateGetTestSetup;
const validateUpdateTestSetup = require("../validation/testsetup").validateUpdateTestSetup;

module.exports = {
  getAllTestSetupItems: async function(req, res) {
    const { errors, isValid } = validateGetTestSetup(req.query);
    // Check Validation
    if (!isValid) {
      return res.status(400).json(errors);
    }

    var project_exists = await ProjectService.checkIfProjectExist(req.query.project_id);
    if (!project_exists) {
      return res.status(404).json({ error: "Project doesn't exist" });
    }

    var canEditTestSetup = await UserService.canEditTestSetup(req.user);
    if (!canEditTestSetup) {
      return res.status(403).json({ message: "Forbidden" });
    }

    var testSetupItems = await TestSetupService.getAlltestSetupItems(req.query.project_id);

    if (testSetupItems) {
      return res.status(200).json(testSetupItems);
    } else {
      return res.status(500).json({ error: "Something went wrong" });
    }
  },
  seTestSetupItemIsUsed: async function(req, res) {
    const { errors, isValid } = validateUpdateTestSetup(req.query);
    // Check Validation
    if (!isValid) {
      return res.status(400).json(errors);
    }

    var project_exists = await ProjectService.checkIfProjectExist(req.query.project_id);
    if (!project_exists) {
      return res.status(404).json({ error: "Project doesn't exist" });
    }

    var testsetupitem_exists = await TestSetupService.checkIfTestSetupItemExist(req.query.testsetupitem_id);
    if (!testsetupitem_exists) {
      return res.status(404).json({ error: "Test setup item doesn't exist" });
    }

    var canEditTestSetup = await UserService.canEditTestSetup(req.user);
    if (!canEditTestSetup) {
      return res.status(403).json({ message: "Forbidden" });
    }

    var setIsUsed = await TestSetupService.setAsUsed(req.query.project_id, req.query.testsetupitem_id, req.query.used);
    if (setIsUsed) {
      if (req.query.used == "true") {
        res.status(200).json({ success: "Test setup item set as used on project" });
      } else {
        res.status(200).json({ success: "Test setup item set as not used on project" });
      }
    } else {
      res.status(500).json({ error: "Something went wrong" });
    }
  }
};
