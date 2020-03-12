const Sequelize = require("sequelize");
const pgURI = require("../config/keys").postgresURI;
const sequelize = new Sequelize(pgURI);
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
const GroupTestCase = require("../models/grouptestcase");
const ReportLink = require("../models/reportlink");
const Link = require("../models/link");
const TestStep = require("../models/teststep");

const paginate = require("../utils/pagination").paginate;

module.exports = {
  createReport: async function(report_fields) {
    return new Promise((resolve, reject) => {
      Report.create(report_fields).then(report => {
        if (report) {
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
            input_data: report_steps[i].input_data,
            expected_result: report_steps[i].expected_result
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
  addLinks: async function(hasLinks, report_links, report) {
    return new Promise((resolve, reject) => {
      if (hasLinks) {
        var arrayReportLinks = new Array();
        for (var i = 0; i < report_links.length; i++) {
          arrayReportLinks.push({
            report_id: report.id,
            title: report_links[i].title,
            value: report_links[i].value
          });
        }
        ReportLink.bulkCreate(arrayReportLinks).then(reportlinks => {
          if (reportlinks) {
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

  returnCreatedReport: async function(report, report_setup, report_steps, report_links, project_id) {
    return new Promise((resolve, reject) => {
      if (report_setup && report_steps && report && report_links) {
        Report.findOne({
          attributes: ["id", "actual_result", "created_at", "comment", "additional_precondition"],
          where: {
            id: report.id
          },
          include: [
            {
              model: TestCase,
              as: "testcase",
              attributes: ["id", "project_id", "title", "description", "preconditions", "expected_result"],
              required: true,
              where: {
                project_id: project_id
              },
              include: [
                {
                  model: Group,
                  attributes: ["id", "title"],
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
                },
                {
                  model: User,
                  attributes: ["id", "first_name", "last_name", "email", "position"],
                  required: true,
                  as: "user"
                },
                {
                  model: Link,
                  attributes: ["id", "value", "title"],
                  required: false
                },
                {
                  model: TestStep,
                  attributes: ["id", ["title", "value"], "expected_result"],
                  required: false,
                  as: "test_steps"
                }
              ],
              order: [[{ model: TestStep, as: "test_steps" }, "id", "ASC"]]
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
              attributes: ["id", ["step", "value"], "input_data", "expected_result"],
              required: false
            },
            {
              model: ReportLink,
              as: "links",
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
          order: [
            [{ model: ReportStep, as: "steps" }, "id", "ASC"],
            [{ model: TestCase, as: "testcase" }, { model: TestStep, as: "test_steps" }, "id", "ASC"]
          ]
        }).then(report => {
          if (report) {
            var report_obj = {};
            report_obj.testcase = {};
            report_obj.id = report.id;
            report_obj.actual_result = report.actual_result;
            report_obj.testcase.description = report.testcase.description;
            report_obj.testcase.preconditions = report.testcase.preconditions;
            report_obj.testcase.expected_result = report.testcase.expected_result;
            report_obj.created_at = report.created_at;
            report_obj.comment = report.comment;
            report_obj.additional_precondition = report.additional_precondition;
            report_obj.testcase.id = report.testcase.id;
            report_obj.testcase.title = report.testcase.title;
            report_obj.testcase.project_id = report.testcase.project_id;
            report_obj.status = report.status;
            report_obj.user = report.user;
            report_obj.steps = report.steps;
            report_obj.reportsetup = report.reportsetup;
            report_obj.testcase.groups = report.testcase.groups;
            report_obj.testcase.user = report.testcase.user;
            report_obj.testcase.created_at = report.testcase.created_at;
            report_obj.links = report.links;
            report_obj.testcase.links = report.testcase.links;
            report_obj.testcase.steps = report.testcase.test_steps;

            resolve(report_obj);
          } else {
            resolve(false);
          }
        });
      }
    });
  },

  returnReportById: async function(reportId, project_id) {
    return new Promise((resolve, reject) => {
      Report.findOne({
        attributes: ["id", "actual_result", "created_at", "comment", "additional_precondition"],
        where: {
          id: reportId
        },
        include: [
          {
            model: TestCase,
            as: "testcase",
            attributes: ["id", "project_id", "title", "description", "preconditions", "expected_result", "created_at"],
            required: true,
            where: {
              project_id: project_id
            },
            include: [
              {
                model: Group,
                attributes: ["id", "title"],
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
              },
              {
                model: User,
                attributes: ["id", "first_name", "last_name", "email", "position"],
                required: true,
                as: "user"
              },
              {
                model: Link,
                attributes: ["id", "value", "title"],
                required: false
              },
              {
                model: TestStep,
                attributes: ["id", ["title", "value"], "expected_result"],
                required: false,
                as: "test_steps",
                order: [{ model: TestStep, as: "test_steps" }, "id", "ASC"]
              }
            ],
            order: [[{ model: TestStep, as: "test_steps" }, "id", "ASC"]]
          },

          {
            model: Status,
            as: "status",
            attributes: ["title"],
            required: true
          },
          {
            model: ReportLink,
            as: "links",
            required: false
          },
          {
            model: User,
            as: "user",
            attributes: ["id", "first_name", "last_name", "email", "position"],
            required: true
          },
          {
            model: ReportStep,
            attributes: ["id", ["step", "value"], "input_data", "expected_result"],
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
        order: [
          [{ model: ReportStep, as: "steps" }, "id", "ASC"],
          [{ model: TestCase, as: "testcase" }, { model: TestStep, as: "test_steps" }, "id", "ASC"]
        ]
      }).then(report => {
        if (report) {
          var report_obj = {};
          report_obj.testcase = {};
          report_obj.id = report.id;
          report_obj.actual_result = report.actual_result;
          report_obj.testcase.description = report.testcase.description;
          report_obj.testcase.preconditions = report.testcase.preconditions;
          report_obj.testcase.expected_result = report.testcase.expected_result;
          report_obj.created_at = report.created_at;
          report_obj.comment = report.comment;
          report_obj.additional_precondition = report.additional_precondition;
          report_obj.testcase.id = report.testcase.id;
          report_obj.testcase.title = report.testcase.title;
          report_obj.testcase.project_id = report.testcase.project_id;
          report_obj.status = report.status;
          report_obj.user = report.user;
          report_obj.steps = report.steps;
          report_obj.reportsetup = report.reportsetup;
          report_obj.testcase.groups = report.testcase.groups;
          report_obj.testcase.user = report.testcase.user;
          report_obj.testcase.created_at = report.testcase.created_at;
          report_obj.links = report.links;
          report_obj.testcase.links = report.testcase.links;
          report_obj.testcase.steps = report.testcase.test_steps;

          resolve(report_obj);
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
  getReportsIds: async function(project_id, page, pageSize, requestObject) {
    return new Promise((resolve, reject) => {
      groupCondition = " ";
      statusCondition = " ";
      devicesCondition = " ";
      simulatorsCondition = " ";
      browsersCondition = " ";
      operating_systemsCondition = " ";
      versionsCondition = " ";
      environmentsCondition = " ";

      userCondition = " ";
      dateToCondition = " ";
      dateFromCondition = " ";
      searchTermCondition = " ";
      limitOffsetCondition = " ";

      if (requestObject.statuses) {
        if (requestObject.statuses.length > 0) {
          var statusesString = "";
          for (var i = 0; i < requestObject.statuses.length; i++) {
            if (i + 1 == requestObject.statuses.length) {
              statusesString = statusesString + ` ${requestObject.statuses[i]} `;
            } else {
              statusesString = statusesString + ` ${requestObject.statuses[i]}, `;
            }
          }

          statusCondition = statusCondition + ` and "status_id" in (${statusesString})`;
        }
      }

      if (requestObject.devices) {
        if (requestObject.devices.length > 0) {
          var devicesString = "";
          for (var i = 0; i < requestObject.devices.length; i++) {
            if (i + 1 == requestObject.devices.length) {
              devicesString = devicesString + ` ${requestObject.devices[i]} `;
            } else {
              devicesString = devicesString + ` ${requestObject.devices[i]}, `;
            }
          }

          devicesCondition =
            devicesCondition +
            ` and "id" in (select "report_id" from "reportsetups" where "report_id"="reports"."id" and "device_id" in (${devicesString}))`;
        }
      }

      if (requestObject.browsers) {
        if (requestObject.browsers.length > 0) {
          var browsersString = "";
          for (var i = 0; i < requestObject.browsers.length; i++) {
            if (i + 1 == requestObject.browsers.length) {
              browsersString = browsersString + ` ${requestObject.browsers[i]} `;
            } else {
              browsersString = browsersString + ` ${requestObject.browsers[i]}, `;
            }
          }

          browsersCondition =
            browsersCondition +
            ` and "id" in (select "report_id" from "reportsetups" where "report_id"="reports"."id" and "browser_id" in (${browsersString}))`;
        }
      }
      if (requestObject.versions) {
        if (requestObject.versions.length > 0) {
          var versionsString = "";
          for (var i = 0; i < requestObject.versions.length; i++) {
            if (i + 1 == requestObject.versions.length) {
              versionsString = versionsString + ` ${requestObject.versions[i]} `;
            } else {
              versionsString = versionsString + ` ${requestObject.versions[i]}, `;
            }
          }

          versionsCondition =
            versionsCondition +
            ` and "id" in (select "report_id" from "reportsetups" where "report_id"="reports"."id" and "version_id" in (${versionsString}))`;
        }
      }

      if (requestObject.environments) {
        if (requestObject.environments.length > 0) {
          var environmentsString = "";
          for (var i = 0; i < requestObject.environments.length; i++) {
            if (i + 1 == requestObject.environments.length) {
              environmentsString = environmentsString + ` ${requestObject.environments[i]} `;
            } else {
              environmentsString = environmentsString + ` ${requestObject.environments[i]}, `;
            }
          }

          environmentsCondition =
            environmentsCondition +
            ` and "id" in (select "report_id" from "reportsetups" where "report_id"="reports"."id" and "environment_id" in (${environmentsString}))`;
        }
      }

      if (requestObject.simulators) {
        if (requestObject.simulators.length > 0) {
          var simulatorsString = "";
          for (var i = 0; i < requestObject.simulators.length; i++) {
            if (i + 1 == requestObject.simulators.length) {
              simulatorsString = simulatorsString + ` ${requestObject.simulators[i]} `;
            } else {
              simulatorsString = simulatorsString + ` ${requestObject.simulators[i]}, `;
            }
          }

          simulatorsCondition =
            simulatorsCondition +
            ` and "id" in (select "report_id" from "reportsetups" where "report_id"="reports"."id" and "simulator_id" in (${simulatorsString}))`;
        }
      }

      if (requestObject.operating_systems) {
        if (requestObject.operating_systems.length > 0) {
          var operating_systemsString = "";
          for (var i = 0; i < requestObject.operating_systems.length; i++) {
            if (i + 1 == requestObject.operating_systems.length) {
              operating_systemsString = operating_systemsString + ` ${requestObject.operating_systems[i]} `;
            } else {
              operating_systemsString = operating_systemsString + ` ${requestObject.operating_systems[i]}, `;
            }
          }

          operating_systemsCondition =
            operating_systemsCondition +
            ` and "id" in (select "report_id" from "reportsetups" where "report_id"="reports"."id" and "operating_system_id" in (${operating_systemsString}))`;
        }
      }

      if (requestObject.groups) {
        if (requestObject.groups.length > 0) {
          requestObject.groups.forEach(group => {
            groupCondition =
              groupCondition +
              ` and "test_case_id" in (select "test_case_id" from "grouptestcases" where "group_id" = ${group})`;
          });
        }
      }
      if (requestObject.date_to) {
        dateToCondition = ` and "created_at" <= '${requestObject.date_to}'`;
      }
      if (requestObject.date_from) {
        dateFromCondition = ` and "created_at" >= '${requestObject.date_from}'`;
      }
      if (requestObject.search_term) {
        if (requestObject.search_term.length > 0) {
          searchTermCondition = `  and "test_case_id" in (select "id" from "testcases" where "title" ilike '%${requestObject.search_term}%')`;
        }
      }
      if (requestObject.users) {
        if (requestObject.users.length > 0) {
          userCondition = `and "user_id" in (${requestObject.users})`;
        }
      }
      if (page >= 0 && pageSize) {
        limitOffsetCondition = `offset ${(page - 1) * pageSize} limit ${pageSize}`;
      }
      sequelize
        .query(
          `select "id" from "reports" where "test_case_id" in (select "id" from "testcases" where "project_id"=${project_id}) ${groupCondition} ${userCondition} ${dateToCondition} ${dateFromCondition} ${searchTermCondition} ${statusCondition} ${devicesCondition} ${browsersCondition} ${versionsCondition} ${environmentsCondition} ${operating_systemsCondition} ${simulatorsCondition}  order by "created_at" desc ${limitOffsetCondition}`,
          { type: sequelize.QueryTypes.SELECT }
        )
        .then(reports => {
          sequelize
            .query(
              `select count("id") from "reports" where "test_case_id" in (select "id" from "testcases" where "project_id"=${project_id}) ${groupCondition} ${userCondition} ${dateToCondition} ${dateFromCondition} ${searchTermCondition} ${statusCondition} ${devicesCondition} ${browsersCondition} ${versionsCondition} ${environmentsCondition} ${operating_systemsCondition} ${simulatorsCondition}`,
              { type: sequelize.QueryTypes.SELECT }
            )
            .then(count => {
              var report_ids = [];
              if (reports) {
                reports.forEach(reports_id => {
                  report_ids.push(reports_id.id);
                });
              }
              resolve({ report_ids: report_ids, count: count[0].count });
            });
        });
    });
  },
  getAllReportsPaginatedWithGgroups: async function(report_ids, pageNo, pageSize, count) {
    return new Promise((resolve, reject) => {
      Report.findAll({
        where: {
          id: {
            [Op.in]: report_ids
          }
        },
        include: [
          {
            model: TestCase,
            as: "testcase",
            attributes: ["id", "project_id", "title", "description", "preconditions", "expected_result", "created_at"],
            required: true,

            include: [
              {
                model: Group,
                attributes: ["id", "title"],
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
              },
              {
                model: User,
                attributes: ["id", "first_name", "last_name", "email", "position"],
                required: true,
                as: "user"
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
        order: [["id", "desc"]]
      }).then(reportsArr => {
        if (reportsArr.length == 0) {
          var page = Number(1);
          var pages = Number(0);
          var reports = [];

          resolve({ reports, page, pages });
        } else {
          var reports = Array();

          var reportsCount = reportsArr.length;

          reportsArr.forEach(report => {
            var report_obj = {};
            report_obj.testcase = {};
            report_obj.id = report.id;
            report_obj.actual_result = report.actual_result;
            report_obj.testcase.description = report.testcase.description;
            report_obj.testcase.preconditions = report.testcase.preconditions;
            report_obj.testcase.expected_result = report.testcase.expected_result;
            report_obj.created_at = report.created_at;
            report_obj.comment = report.comment;
            report_obj.additional_precondition = report.additional_precondition;
            report_obj.testcase.id = report.testcase.id;
            report_obj.testcase.title = report.testcase.title;
            report_obj.testcase.project_id = report.testcase.project_id;
            report_obj.status = report.status;
            report_obj.user = report.user;
            report_obj.steps = report.steps;
            report_obj.reportsetup = report.reportsetup;
            report_obj.testcase.groups = report.testcase.groups;
            report_obj.testcase.user = report.testcase.user;
            report_obj.testcase.created_at = report.testcase.created_at;
            report_obj.links = report.links;
            report_obj.testcase.links = report.testcase.links;

            reports.push(report_obj);
            if (reportsCount > 0) {
              reportsCount = reportsCount - 1;
            }
            if (reportsCount == 0) {
              var page = Number(1);
              var pages = Number(0);
              if (reports.length > 0) {
                page = Number(pageNo);

                pages = Math.ceil(count / pageSize);
              }
              resolve({ reports, page, pages });
            }
          });
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
            attributes: ["id", "project_id", "title", "description", "preconditions", "expected_result", "created_at"],
            required: true,
            where: {
              project_id: project_id
            },
            include: [
              {
                model: User,
                attributes: ["id", "first_name", "last_name", "email", "position"],
                required: true,
                as: "user"
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
        order: [["id", "desc"]]
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

  getAllReportsWithGroups: async function(reports) {
    return new Promise((resolve, reject) => {
      var reportsWithGroups = Array();
      var reportsCount = reports.length;
      reports.forEach(report => {
        var report_obj = {};
        report_obj.testcase = {};
        report_obj.id = report.id;
        report_obj.actual_result = report.actual_result;
        report_obj.testcase.description = report.testcase.description;
        report_obj.testcase.preconditions = report.testcase.preconditions;
        report_obj.testcase.expected_result = report.testcase.expected_result;
        report_obj.created_at = report.created_at;
        report_obj.comment = report.comment;
        report_obj.additional_precondition = report.additional_precondition;
        report_obj.testcase.id = report.testcase.id;
        report_obj.testcase.title = report.testcase.title;
        report_obj.testcase.project_id = report.testcase.project_id;
        report_obj.status = report.status;
        report_obj.user = report.user;
        report_obj.steps = report.steps;
        report_obj.reportsetup = report.reportsetup;
        report_obj.testcase.groups = report.testcase.groups;
        report_obj.testcase.user = report.testcase.user;
        report_obj.testcase.created_at = report.testcase.created_at;
        report_obj.links = report.links;
        report_obj.testcase.links = report.testcase.links;
        report_obj.testcase.steps = report.testcase.test_steps;

        GroupTestCase.findAll({
          where: {
            test_case_id: report_obj.testcase.id
          },
          include: [
            {
              model: Group,
              as: "group",
              attributes: ["id", "title"],
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
        }).then(groups => {
          var groupsArr = [];
          groups.forEach(group => {
            var groupObj = {};
            groupObj.id = group.group.id;
            groupObj.title = group.group.title;
            groupObj.color = group.group.color;
            groupsArr.push(groupObj);
          });
          report_obj.groups = groupsArr;

          reportsWithGroups.push(report_obj);
          if (reportsCount > 0) {
            reportsCount = reportsCount - 1;
          }
          if (reportsCount == 0) {
            resolve(reportsWithGroups);
          }
        });
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
            attributes: ["id", "project_id", "title", "description", "preconditions", "expected_result", "created_at"],
            required: true,
            where: {
              project_id: project_id
            },
            include: [
              {
                model: Group,
                attributes: ["id", "title"],
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
              },
              {
                model: User,
                attributes: ["id", "first_name", "last_name", "email", "position"],
                required: true,
                as: "user"
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
        order: [["id", "desc"]]
      }).then(reportsArr => {
        var reports = Array();
        var reportsCount = reportsArr.length;
        reportsArr.forEach(report => {
          var report_obj = {};
          report_obj.testcase = {};
          report_obj.id = report.id;
          report_obj.actual_result = report.actual_result;
          report_obj.testcase.description = report.testcase.description;
          report_obj.testcase.preconditions = report.testcase.preconditions;
          report_obj.testcase.expected_result = report.testcase.expected_result;
          report_obj.created_at = report.created_at;
          report_obj.comment = report.comment;
          report_obj.additional_precondition = report.additional_precondition;
          report_obj.testcase.id = report.testcase.id;
          report_obj.testcase.title = report.testcase.title;
          report_obj.testcase.project_id = report.testcase.project_id;
          report_obj.status = report.status;
          report_obj.user = report.user;
          report_obj.steps = report.steps;
          report_obj.reportsetup = report.reportsetup;
          report_obj.testcase.groups = report.testcase.groups;
          report_obj.testcase.user = report.testcase.user;
          report_obj.testcase.created_at = report.testcase.created_at;
          report_obj.links = report.links;
          report_obj.testcase.links = report.testcase.links;

          reports.push(report_obj);
          if (reportsCount > 0) {
            reportsCount = reportsCount - 1;
          }
          if (reportsCount == 0) {
            var page = 1;
            var pages = 0;
            if (reports.length > 0) {
              page = 1;
              pages = 1;
            }
            resolve({ reports, page, pages });
          }
        });
      });
    });
  },
  getReportStatuses: async function() {
    return new Promise((resolve, reject) => {
      Status.findAll({
        attributes: ["id", "title"],
        order: [["id", "ASC"]]
      }).then(statuses => {
        resolve(statuses);
      });
    });
  }
};
