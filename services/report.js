const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const Report = require("../models/report");
const ReportSetup = require("../models/reportsetup");
const Status = require("../models/status");
const Browser = require("../models/browser");
const Environment = require("../models/environment");
const Device = require("../models/device");
const Simulator = require("../models/simulator");
const Version = require("../models/version");
const OperatingSystem = require("../models/operatingsystem");
const ReportStep = require("../models/reportstep");
const TestCase = require("../models/testcase");
const User = require("../models/user");
const Group = require("../models/group");
const Color = require("../models/color");

const paginate = require("../utils/pagination").paginate;

module.exports = {
  createReport: async function(report_fields) {
    return new Promise((resolve, reject) => {
      Report.create(report_fields).then(report => {
        if (report) {
          //   var reportObj = {};
          //   reportObj.id = report.id;
          //   reportObj.title = report.title;
          //   reportObj.screen_resolution = report.screen_resolution;
          //   reportObj.version = report.version;
          //   reportObj.used = report.used;
          resolve(report);
        } else {
          resolve(false);
        }
      });
    });
  },
  CreateReportSetup: async function(report, setup_fields) {
    return new Promise((resolve, reject) => {
      var setupFields = {};
      setupFields.browser_id = setup_fields.browser_id;
      setupFields.environment_id = setup_fields.environment_id;
      setupFields.device_id = setup_fields.device_id;
      setupFields.simulator_id = setup_fields.simulator_id;
      setupFields.version_id = setup_fields.version_id;
      setupFields.operating_system_id = setup_fields.operating_system_id;
      setupFields.report_id = report.id;
      ReportSetup.create(setupFields).then(report_setup => {
        if (report_setup) {
          resolve(report_setup);
        } else {
          resolve(false);
        }
      });
    });
  },

  addTestSteps: async function(hasSteps, report_steps, report) {
    return new Promise((resolve, reject) => {
      if (hasSteps) {
        var arrayReportSteps = new Array();
        for (var i = 0; i < report_steps.length; i++) {
          arrayReportSteps.push({
            report_id: report.id,
            step: report_steps[i].step,
            input_data: report_steps[i].input_data
          });
        }
        ReportStep.bulkCreate(arrayReportSteps).then(reportsteps => {
          if (reportsteps) {
            resolve(true);
          } else {
            resolve(false);
          }
        });
      } else {
        resolve(true);
      }
    });
  },

  returnCreatedReport: async function(report, report_setup, report_steps) {
    return new Promise((resolve, reject) => {
      if (report_setup && report_steps && report) {
        Report.findOne({
          attributes: ["id", "actual_result", "created_at", "comment", "additional_precondition"],
          where: {
            id: report.id
          },
          include: [
            {
              model: Status,
              as: "status",
              attributes: ["title"],
              required: true
            },
            {
              model: ReportStep,
              as: "steps",
              required: false
            },
            {
              model: ReportSetup,
              as: "reportsetup",
              attributes: ["id"],
              required: true,
              include: [
                {
                  model: Browser,
                  as: "browser",
                  required: false
                },
                {
                  model: Environment,
                  as: "environment",
                  required: false
                },
                {
                  model: Device,
                  as: "device",
                  required: false
                },
                {
                  model: Simulator,
                  as: "simulator",
                  required: false
                },
                {
                  model: Version,
                  as: "version",
                  required: false
                },
                {
                  model: OperatingSystem,
                  as: "operatingsystem",
                  required: false
                }
              ]
            }
          ]
        }).then(report => {
          if (report) {
            resolve(report);
          } else {
            resolve(false);
          }
        });
      }
    });
  },

  returnReportById: async function(reportId) {
    return new Promise((resolve, reject) => {
      Report.findOne({
        attributes: ["id", "actual_result", "created_at", "comment", "additional_precondition"],
        where: {
          id: reportId
        },
        include: [
          {
            model: Status,
            as: "status",
            attributes: ["title"],
            required: true
          },
          {
            model: User,
            as: "user",
            attributes: ["id", "first_name", "last_name", "email"],
            required: true
          },
          {
            model: ReportStep,
            as: "steps",
            required: false
          },
          {
            model: ReportSetup,
            as: "reportsetup",
            attributes: ["id"],
            required: true,
            include: [
              {
                model: Browser,
                as: "browser",
                required: false
              },
              {
                model: Environment,
                as: "environment",
                required: false
              },
              {
                model: Device,
                as: "device",
                required: false
              },
              {
                model: Simulator,
                as: "simulator",
                required: false
              },
              {
                model: Version,
                as: "version",
                required: false
              },
              {
                model: OperatingSystem,
                as: "operatingsystem",
                required: false
              }
            ]
          }
        ]
      }).then(report => {
        if (report) {
          resolve(report);
        } else {
          resolve(false);
        }
      });
    });
  },
  getReportProject: async function(id) {
    return new Promise((resolve, reject) => {
      Report.findOne({
        attributes: ["test_case_id"],
        where: {
          id: id
        },
        include: [
          {
            model: TestCase,
            as: "testcase",
            attributes: ["project_id"],
            required: true
          }
        ]
      }).then(report => {
        if (report) {
          resolve(report.testcase.project_id);
        } else {
          resolve(false);
        }
      });
    });
  },
  getAllReportsPaginated: async function(project_id, page, pageSize) {
    return new Promise((resolve, reject) => {
      Report.findAndCountAll({
        include: [
          {
            model: TestCase,
            as: "testcase",
            attributes: ["project_id", "title"],
            required: true,
            where: {
              project_id: project_id
            },
            include: [
              {
                model: Group,
                attributes: ["id", "title", "color_id", "pinned"],
                through: {
                  attributes: []
                },
                as: "groups",
                required: true,
                include: [
                  {
                    model: Color,
                    as: "color",
                    attributes: ["title"],
                    required: true
                  }
                ]
              }
            ]
          },
          {
            model: Status,
            as: "status",
            attributes: ["title"],
            required: true
          },
          {
            model: User,
            as: "user",
            attributes: ["id", "first_name", "last_name", "email", "position"],
            required: true
          },
          {
            model: ReportStep,
            as: "steps",
            required: false
          },
          {
            model: ReportSetup,
            as: "reportsetup",
            required: true,
            include: [
              {
                model: Browser,
                as: "browser",
                required: false
              },
              {
                model: Environment,
                as: "environment",
                required: false
              },
              {
                model: Device,
                as: "device",
                required: false
              },
              {
                model: Simulator,
                as: "simulator",
                required: false
              },
              {
                model: Version,
                as: "version",
                required: false
              },
              {
                model: OperatingSystem,
                as: "operatingsystem",
                required: false
              }
            ]
          }
        ],
        attributes: ["id", "actual_result", "created_at", "comment", "additional_precondition"],
        ...paginate({ page, pageSize }),
        order: [
          ["id", "desc"],
          [{ model: ReportStep, as: "steps" }, "id", "ASC"]
        ]
      }).then(report_obj => {
        var reports = report_obj.rows;
        var pages = 1;
        if (report_obj.count > 0) {
          pages = Math.ceil(report_obj.count / pageSize);
        }
        page = Number(page);

        resolve({ reports, page, pages });
      });
    });
  },
  getAllReports: async function(project_id) {
    return new Promise((resolve, reject) => {
      Report.findAll({
        include: [
          {
            model: TestCase,
            as: "testcase",
            attributes: ["project_id", "title"],
            required: true,
            where: {
              project_id: project_id
            },
            include: [
              {
                model: Group,
                attributes: ["id", "title", "color_id", "pinned"],
                through: {
                  attributes: []
                },
                as: "groups",
                required: true,
                include: [
                  {
                    model: Color,
                    as: "color",
                    attributes: ["title"],
                    required: true
                  }
                ]
              }
            ]
          },
          {
            model: Status,
            as: "status",
            attributes: ["title"],
            required: true
          },
          {
            model: User,
            as: "user",
            attributes: ["id", "first_name", "last_name", "email", "position"],
            required: true
          },
          {
            model: ReportStep,
            as: "steps",
            required: false
          },
          {
            model: ReportSetup,
            as: "reportsetup",
            attributes: ["id"],
            required: true,
            include: [
              {
                model: Browser,
                as: "browser",
                required: false
              },
              {
                model: Environment,
                as: "environment",
                required: false
              },
              {
                model: Device,
                as: "device",
                required: false
              },
              {
                model: Simulator,
                as: "simulator",
                required: false
              },
              {
                model: Version,
                as: "version",
                required: false
              },
              {
                model: OperatingSystem,
                as: "operatingsystem",
                required: false
              }
            ]
          }
        ],
        attributes: ["id", "actual_result", "created_at", "comment", "additional_precondition"],
        order: [["id", "DESC"]]
      }).then(reports => {
        var page = 1;
        var pages = 0;
        if (reports.length > 0) {
          page = 1;
          pages = 1;
        }
        resolve({ reports, page, pages });
      });
    });
  }
};
