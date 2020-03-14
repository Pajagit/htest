var UserService = require("../services/user");
var TestcaseService = require("../services/testcase");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;

const validateTestCaseFilter = require("../validation/testcase").validateTestCaseFilter;

module.exports = {
  getAllTestcases: async function(req, res) {
    (async () => {
      if (isNaN(req.query.project_id)) {
        return res.status(400).json({ error: "Project id is not valid number" });
      }
      var whereStatement = {};
      var whereStatementGroups = {};
      var whereStatementUsers = {};
      var requestObject = {};

      requestObject.groups = req.body.groups ? req.body.groups : [];
      requestObject.users = req.body.users ? req.body.users : [];
      requestObject.date_from = req.body.date_from ? req.body.date_from : "";
      requestObject.date_to = req.body.date_to ? req.body.date_to : "";
      requestObject.search_term = req.body.search_term ? req.body.search_term : "";
      requestObject.page = page = req.query.page;
      requestObject.page_size = pageSize = req.query.page_size;

      const { errors, isValid } = validateTestCaseFilter(requestObject);

      // Check Validation
      if (!isValid) {
        return res.status(400).json(errors);
      }

      var getTestCase = await UserService.getTestCase(req.user, req.query.project_id);
      if (!getTestCase) {
        return res.status(403).json({ message: "Forbidden" });
      }

      if (requestObject.date_from && requestObject.date_to) {
        whereStatement.created_at = {
          [Op.gte]: new Date(requestObject.date_from + "T00:00:00"),
          [Op.lte]: new Date(requestObject.date_to + "T23:59:59.999")
        };
      } else {
        if (requestObject.date_to) {
          whereStatement.created_at = { [Op.lte]: new Date(requestObject.date_to + "T23:59:59.999") };
        } else {
          if (requestObject.date_from) {
            whereStatement.created_at = { [Op.gte]: new Date(requestObject.date_from + "T00:00:00") };
          }
        }
      }
      if (requestObject.groups.length > 0) {
        whereStatementGroups.id = { [Op.in]: requestObject.groups };
      }
      if (requestObject.users.length > 0) {
        whereStatementUsers.id = { [Op.in]: requestObject.users };
      }
      if (requestObject.search_term.length > 0) {
        whereStatement.title = {
          [Op.iLike]: "%" + requestObject.search_term + "%"
        };
      }
      whereStatement.project_id = req.query.project_id;
      whereStatement.deprecated = false;

      var testCaseIds = await TestcaseService.getTestcasesIds(req.query.project_id, page, pageSize, requestObject);

      whereStatement.id = {
        [Op.in]: testCaseIds.ids
      };

      var testcases = await TestcaseService.getTestcases(
        testCaseIds,
        whereStatement,
        whereStatementUsers,
        requestObject
      );
      if (testcases) {
        return res.status(200).json(testcases);
      } else {
        return res.status(500).json("Something went wrong");
      }
    })();
  }
};
