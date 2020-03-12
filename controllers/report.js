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
const TestSetupService = require("../services/testsetup");
const GroupService = require("../services/group");

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
  getReportStatuses: async function(req, res) {
    var reportStatuses = await ReportService.getReportStatuses();
    return res.status(200).json(reportStatuses);
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

      if (req.body.links) {
        var linksArray = req.body.links.filter(Boolean);
      }
      var hasLinks = false;
      if (linksArray) {
        hasLinks = true;
      }
      var created_report = await ReportService.createReport(reportFields);
      if (created_report) {
        var created_report_setup = await ReportService.CreateReportSetup(created_report, setupFields);
        var created_report_steps = await ReportService.addTestSteps(hasSteps, stepsArray, created_report);
        var created_report_links = await ReportService.addLinks(hasLinks, linksArray, created_report);

        var report = await ReportService.returnCreatedReport(
          created_report,
          created_report_setup,
          created_report_steps,
          created_report_links,
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
    var requestObject = {};

    requestObject.groups = req.body.groups ? req.body.groups : [];
    requestObject.statuses = req.body.statuses ? req.body.statuses : [];
    requestObject.devices = req.body.devices ? req.body.devices : [];
    requestObject.browsers = req.body.browsers ? req.body.browsers : [];
    requestObject.versions = req.body.versions ? req.body.versions : [];
    requestObject.environments = req.body.environments ? req.body.environments : [];
    requestObject.simulators = req.body.simulators ? req.body.simulators : [];
    requestObject.operating_systems = req.body.operating_systems ? req.body.operating_systems : [];

    requestObject.users = req.body.users ? req.body.users : [];
    requestObject.date_from = req.body.date_from ? req.body.date_from : "";
    requestObject.date_to = req.body.date_to ? req.body.date_to : "";
    requestObject.search_term = req.body.search_term ? req.body.search_term : "";
    requestObject.page = page = req.query.page;
    requestObject.page_size = pageSize = req.query.page_size;
    if (req.query.page >= 0 && req.query.page_size) {
      var reports = await ReportService.getReportsIds(
        req.query.project_id,
        req.query.page,
        req.query.page_size,
        requestObject
      );
      var reportsAll = await ReportService.getAllReportsPaginatedWithGgroups(
        reports.report_ids,
        req.query.page,
        req.query.page_size,
        reports.count
      );
    } else {
    }
    if (reportsAll) {
      return res.status(200).json(reportsAll);
    } else {
      return res.status(500).json({ error: "Something went wrong" });
    }
  },
  getReportSetup: async function(req, res) {
    if (isNaN(req.params.id)) {
      return res.status(400).json({ error: "Testcase id is not a valid number" });
    }
    var testcase_exists = await TestcaseService.checkIfTestcaseExist(req.params.id);
    if (!testcase_exists) {
      return res.status(400).json({ error: "Testcase doesn't exist" });
    }

    var testcase_project = await TestcaseService.getTestcaseProject(req.params.id);
    var canGetTestcase = await UserService.getTestCase(req.user, testcase_project.project_id);
    if (!canGetTestcase) {
      return res.status(403).json({ message: "Forbidden" });
    }

    var testSetupItems = await TestSetupService.getProjecttestSetupItems(testcase_project.project_id);
    var setupObject = {};
    var devices = false;
    var browsers = false;
    var environments = false;
    var operatingsystems = false;
    var simulators = false;
    var versions = false;

    testSetupItems.forEach(item => {
      if (item.title == "Devices") {
        devices = true;
      }
      if (item.title == "Browsers") {
        browsers = true;
      }
      if (item.title == "Environments") {
        environments = true;
      }
      if (item.title == "Operating Systems") {
        operatingsystems = true;
      }
      if (item.title == "Simulators") {
        simulators = true;
      }
      if (item.title == "Versions") {
        versions = true;
      }
    });
    setupObject.setup = {};
    setupObject.setup.devices = devices;
    setupObject.setup.browsers = browsers;
    setupObject.setup.environments = environments;
    setupObject.setup.operatingsystems = operatingsystems;
    setupObject.setup.simulators = simulators;
    setupObject.setup.versions = versions;

    if (devices) {
      var whereStatement = {};
      whereStatement.deprecated = false;
      var devicesAll = await DeviceService.getAllDevices(whereStatement);
      setupObject.devices = devicesAll.devices;
    }
    if (browsers) {
      var browsersAll = await BrowserService.getAllBrowsers(testcase_project.project_id);
      setupObject.browsers = browsersAll.browsers;
    }
    if (environments) {
      var environmentsAll = await EnvironmentService.getAllEnvironments(testcase_project.project_id);
      setupObject.environments = environmentsAll.environments;
    }
    if (operatingsystems) {
      var ossAll = await OSService.getAllOperatingSystems(testcase_project.project_id);
      setupObject.operatingsystems = ossAll.oss;
    }
    if (simulators) {
      var whereStatement = {};
      whereStatement.deprecated = false;
      whereStatement.project_id = testcase_project.project_id;
      var simulatorsAll = await SimulatorService.getAllSimulators(whereStatement);
      setupObject.simulators = simulatorsAll.simulators;
    }
    if (versions) {
      var versionsAll = await VersionService.getAllVersions(testcase_project.project_id);
      setupObject.versions = versionsAll.versions;
    }
    return res.status(200).json(setupObject);
  },
  getReportFilterSetup: async function(req, res) {
    var setupObject = {};

    var testSetupItems = await TestSetupService.getProjecttestSetupItems(req.params.id);
    var devices = false;
    var browsers = false;
    var environments = false;
    var operatingsystems = false;
    var simulators = false;
    var versions = false;

    testSetupItems.forEach(item => {
      if (item.title == "Devices") {
        devices = true;
      }
      if (item.title == "Browsers") {
        browsers = true;
      }
      if (item.title == "Environments") {
        environments = true;
      }
      if (item.title == "Operating Systems") {
        operatingsystems = true;
      }
      if (item.title == "Simulators") {
        simulators = true;
      }
      if (item.title == "Versions") {
        versions = true;
      }
    });

    setupObject.setup = {};
    setupObject.setup.devices = devices;
    setupObject.setup.browsers = browsers;
    setupObject.setup.environments = environments;
    setupObject.setup.operatingsystems = operatingsystems;
    setupObject.setup.simulators = simulators;
    setupObject.setup.versions = versions;

    var whereStatement = {};
    whereStatement.deprecated = false;
    var devicesArr = await DeviceService.getAllDevices(whereStatement, req.params.id);
    var devicesAll = [];
    for (var i = 0; i < devicesArr.devices.length; i++) {
      var deviceObj = {};
      deviceObj.id = devicesArr.devices[i].id;
      deviceObj.title = devicesArr.devices[i].title;
      deviceObj.dpi = devicesArr.devices[i].dpi;
      deviceObj.resolution = devicesArr.devices[i].resolution;
      deviceObj.udid = devicesArr.devices[i].udid;
      deviceObj.screen_size = devicesArr.devices[i].screen_size;
      deviceObj.retina = devicesArr.devices[i].retina;
      deviceObj.os = devicesArr.devices[i].os;

      deviceObj.used = await DeviceService.checkIfUsed(devicesArr.devices[i].id, req.params.id);
      devicesAll.push(deviceObj);
    }

    setupObject.devices = devicesAll;

    var browsersAll = await BrowserService.getAllBrowsers(req.params.id);
    setupObject.browsers = browsersAll.browsers;

    var environmentsAll = await EnvironmentService.getAllEnvironments(req.params.id);
    setupObject.environments = environmentsAll.environments;

    var ossAll = await OSService.getAllOperatingSystems(req.params.id);
    setupObject.operatingsystems = ossAll.oss;

    var whereStatement = {};
    whereStatement.deprecated = false;
    whereStatement.project_id = req.params.id;
    var simulatorsAll = await SimulatorService.getAllSimulators(whereStatement);
    setupObject.simulators = simulatorsAll.simulators;

    var versionsAll = await VersionService.getAllVersions(req.params.id);
    setupObject.versions = versionsAll.versions;

    var groupsAll = await GroupService.getAllProjectGroups(req.params.id);
    setupObject.groups = groupsAll;

    var statusesAll = await ReportService.getReportStatuses();
    setupObject.statuses = statusesAll;

    var usersAll = await UserService.getUsersWithReports(req.params.id);
    setupObject.users = usersAll;

    return res.status(200).json(setupObject);
  }
};
