const Sequelize = require("sequelize");
const pgURI = require("../config/keys").postgresURI;
const sequelize = new Sequelize(pgURI);
const Op = Sequelize.Op;
const ReportService = require("../services/report");
const UserService = require("../services/user");
const ProjectService = require("../services/project");
const TestcaseService = require("../services/testcase");
const StatusService = require("../services/status");
const BrowserService = require("../services/browser");
const EnvironmentService = require("../services/environment");
const VersionService = require("../services/version");
const DeviceService = require("../services/device");
const SimulatorService = require("../services/simulator");
const OSService = require("../services/operatingsystem");

const validateReportInput = require("../validation/report").validateReportInput;
const validateGetReports = require("../validation/report").validateGetReports;

module.exports = {
  getReport: async function(req, res) {
    if (isNaN(req.params.id)) {
      return res.status(400).json({ error: "Report id is not a valid number" });
    }
    var report_project = await ReportService.getReportProject(req.params.id);
    var canGetReport = await UserService.canGetReports(req.user, report_project);
    if (!canGetReport) {
      return res.status(403).json({ message: "Forbidden" });
    }

    var report = await ReportService.returnReportById(req.params.id, report_project);
    if (report) {
      return res.status(200).json(report);
    } else {
      return res.status(404).json({ error: "Report doesn't exist" });
    }
  },
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
      var setupFields = {};
      if (req.body.browser_id) {
        setupFields.browser_id = req.body.browser_id;

        var browser_exists = await BrowserService.checkIfBrowserExistById(req.body.browser_id);
        if (!browser_exists) {
          return res.status(404).json({ error: "Browser doesn't exist" });
        }
      }
      if (req.body.environment_id) {
        setupFields.environment_id = req.body.environment_id;

        var env_exists = await EnvironmentService.checkIfEnvironmentExistById(req.body.environment_id);
        if (!env_exists) {
          return res.status(404).json({ error: "Environment doesn't exist" });
        }
      }
      if (req.body.device_id) {
        setupFields.device_id = req.body.device_id;

        var device_exists = await DeviceService.checkIfDeviceExistById(req.body.device_id);
        if (!device_exists) {
          return res.status(404).json({ error: "Device doesn't exist" });
        }
      }
      if (req.body.simulator_id) {
        setupFields.simulator_id = req.body.simulator_id;

        var simulator_exists = await SimulatorService.checkIfSimulatorExistById(req.body.simulator_id);
        if (!simulator_exists) {
          return res.status(404).json({ error: "Simulator doesn't exist" });
        }
      }

      if (req.body.version_id) {
        setupFields.version_id = req.body.version_id;

        var version_exists = await VersionService.checkIfVersionExists(req.body.version_id);
        if (!version_exists) {
          return res.status(404).json({ error: "Version doesn't exist" });
        }
      }
      if (req.body.operating_system_id) {
        setupFields.operating_system_id = req.body.operating_system_id;

        var os_exists = await OSService.checkIfOsExists(req.body.operating_system_id);
        if (!os_exists) {
          return res.status(404).json({ error: "Operatig system doesn't exist" });
        }
      }

      if (req.body.steps) {
        var stepsArray = req.body.steps.filter(Boolean);
      }
      var hasSteps = false;
      if (stepsArray) {
        hasSteps = true;
      }
      console.log(project.project_id);
      var created_report = await ReportService.createReport(reportFields);
      if (created_report) {
        var created_report_setup = await ReportService.CreateReportSetup(created_report, setupFields);
        var created_report_steps = await ReportService.addTestSteps(hasSteps, stepsArray, created_report);
        var report = await ReportService.returnCreatedReport(
          created_report,
          created_report_setup,
          created_report_steps,
          project.project_id
        );
        res.json(report);
      } else {
        res.status(500).json({ error: "An error occured while creating report" });
      }
    })();
  },
  getAllReports: async function(req, res) {
    const { errors, isValid } = validateGetReports(req.query);
    // Check Validation
    if (!isValid) {
      return res.status(400).json(errors);
    }
    var project_exists = await ProjectService.checkIfProjectExist(req.query.project_id);
    if (!project_exists) {
      return res.status(404).json({ error: "Project doesn't exist" });
    }

    var canGetReports = await UserService.canGetReports(req.user, req.query.project_id);
    if (!canGetReports) {
      return res.status(403).json({ message: "Forbidden" });
    }
    if (req.query.page >= 0 && req.query.page_size) {
      var reports = await ReportService.getAllReportsPaginated(
        req.query.project_id,
        req.query.page,
        req.query.page_size
      );
      if (reports.reports.length > 0) {
        var reportsWithGroups = await ReportService.getAllReportsWithGroups(reports.reports);
        reports.reports = reportsWithGroups;
      }
    } else {
      var reports = await ReportService.getAllReports(req.query.project_id);
    }
    if (reports) {
      return res.status(200).json(reports);
    } else {
      return res.status(500).json({ error: "Something went wrong" });
    }
  }
};
