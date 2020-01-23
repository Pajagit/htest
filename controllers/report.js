const Sequelize = require("sequelize");
const pgURI = require("../config/keys").postgresURI;
const sequelize = new Sequelize(pgURI);
const Op = Sequelize.Op;
const ReportService = require("../services/report");
const UserService = require("../services/user");
const ProjectService = require("../services/project");
const TestcaseService = require("../services/testcase");
const StatusService = require("../services/status");

const validateReportInput = require("../validation/report").validateReportInput;

module.exports = {
  createReport: async function(req, res) {
    (async () => {
      const { errors, isValid } = validateReportInput(req.body);

      // Check Validation
      if (!isValid) {
        return res.status(400).json(errors);
      }
      var testcase_exists = await TestcaseService.checkIfTestcaseExist(req.body.test_case_id);
      if (!testcase_exists) {
        return res.status(404).json({ error: "Test case doesn't exist" });
      }

      var status_exists = await StatusService.checkIfStatusExist(req.body.status_id);
      if (!status_exists) {
        return res.status(404).json({ error: "Status doesn't exist" });
      }

      var project = await TestcaseService.getTestcaseProject(req.body.test_case_id);
      var canCreateReport = await UserService.canCreateReport(req.user, project.project_id);
      if (!canCreateReport) {
        return res.status(403).json({ message: "Forbidden" });
      }

      var reportFields = {};
      reportFields.test_case_id = req.body.test_case_id;
      reportFields.user_id = req.user.id;
      if (req.body.actual_result) {
        reportFields.actual_result = req.body.actual_result;
      }
      reportFields.status_id = req.body.status_id;
      if (req.body.comment) {
        reportFields.comment = req.body.comment;
      }
      if (req.body.additional_precondition) {
        reportFields.additional_precondition = req.body.additional_precondition;
      }

      var created_report = await ReportService.createReport(reportFields);
      if (created_report) {
        // var report = await ReportService.returnCreatedReport(created_report);
        res.json(created_report);
      } else {
        res.status(500).json({ error: "An error occured while creating report" });
      }
    })();
  }
};
