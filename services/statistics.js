const Sequelize = require("sequelize");
const pgURI = require("../config/keys").postgresURI;
const sequelize = new Sequelize(pgURI);
const Op = Sequelize.Op;
const User = require("../models/user");
const Color = require("../models/color");
const TestStep = require("../models/teststep");
const TestCase = require("../models/testcase");
const Report = require("../models/report");
const Status = require("../models/status");
const ReportSetup = require("../models/reportsetup");
const Version = require("../models/version");
const Link = require("../models/link");
const UploadedFile = require("../models/uploadedfile");
const Group = require("../models/group");

module.exports = {
  getTotalTestcases: async function(project_id) {
    return new Promise((resolve, reject) => {
      TestCase.count({
        attributes: [],
        where: {
          project_id: project_id,
          deprecated: false
        }
      }).then(testcases => {
        if (testcases) {
          resolve(testcases);
        } else {
          resolve(0);
        }
      });
    });
  },

  getTotalReports: async function(project_id) {
    return new Promise((resolve, reject) => {
      Report.count({
        attributes: [],
        include: [
          {
            model: TestCase,
            as: "testcase",
            attributes: [],
            required: true,
            where: {
              project_id: project_id
            }
          }
        ]
      }).then(reports => {
        if (reports) {
          resolve(reports);
        } else {
          resolve(0);
        }
      });
    });
  },
  getTotalReportsPassed: async function(project_id) {
    return new Promise((resolve, reject) => {
      Report.count({
        attributes: [],
        include: [
          {
            model: TestCase,
            as: "testcase",
            attributes: [],
            required: true,
            where: {
              project_id: project_id
            }
          },
          {
            model: Status,
            as: "status",
            attributes: [],
            required: true,
            where: {
              title: "Passed"
            }
          }
        ]
      }).then(reports => {
        if (reports) {
          resolve(reports);
        } else {
          resolve(0);
        }
      });
    });
  },
  getTotalReportsFailed: async function(project_id) {
    return new Promise((resolve, reject) => {
      Report.count({
        attributes: [],
        include: [
          {
            model: TestCase,
            as: "testcase",
            attributes: [],
            required: true,
            where: {
              project_id: project_id
            }
          },
          {
            model: Status,
            as: "status",
            attributes: [],
            required: true,
            where: {
              title: "Failed"
            }
          }
        ]
      }).then(reports => {
        if (reports) {
          resolve(reports);
        } else {
          resolve(0);
        }
      });
    });
  },
  getMostActiveTestcases: async function(project_id, limit) {
    return new Promise((resolve, reject) => {
      Report.findAll({
        attributes: [[sequelize.fn("COUNT", "test_case_id"), "count"]],
        group: ["test_case_id", "testcase.title", "testcase.id"],
        include: [
          {
            model: TestCase,
            as: "testcase",
            attributes: ["title"],
            required: true,
            where: {
              project_id: project_id
            }
          }
        ],
        order: [["count", "DESC"]],
        limit: limit
      }).then(testcases => {
        var testcasesArr = Array();
        if (testcases.length > 0) {
          for (var i = 0; i < testcases.length; i++) {
            var TCobj = {};
            TCobj.title = testcases[i].testcase.title;
            testcasesArr.push(TCobj);
            if (i == testcases.length - 1) {
              resolve(testcasesArr);
            }
          }
        } else {
          resolve([]);
        }
      });
    });
  },
  getCountReportsPassed: async function(test_case_id) {
    return new Promise((resolve, reject) => {
      Report.count({
        where: {
          test_case_id: test_case_id
        },
        include: [
          {
            model: Status,
            as: "status",
            attributes: [],
            required: true,
            where: {
              title: "Passed"
            }
          }
        ]
      }).then(count => {
        if (count) {
          resolve(count);
        } else {
          resolve(0);
        }
      });
    });
  },
  getMostTestcasesFailed: async function(project_id, limit) {
    return new Promise((resolve, reject) => {
      Report.findAll({
        attributes: [[sequelize.fn("COUNT", "test_case_id"), "countReports"]],
        group: ["test_case_id", "testcase.title", "testcase.id"],
        include: [
          {
            model: TestCase,
            as: "testcase",
            attributes: ["title", "id"],
            required: true,
            where: {
              project_id: project_id
            }
          },
          {
            model: Status,
            as: "status",
            attributes: [],
            required: true,
            where: {
              title: "Failed"
            }
          }
        ],
        order: [["count", "DESC"]],
        limit: limit
      }).then(testcases => {
        var testcasesArr = Array();
        if (testcases.length > 0) {
          for (var i = 0; i < testcases.length; i++) {
            var TCobj = {};
            TCobj.title = testcases[i].testcase.title;
            TCobj.test_case_id = testcases[i].testcase.id;
            TCobj.failed = Number(testcases[i].dataValues.countReports);
            testcasesArr.push(TCobj);
            if (i == testcases.length - 1) {
              resolve(testcasesArr);
            }
          }
        } else {
          resolve([]);
        }
      });
    });
  },
  getCountReportsPassedForUser: async function(user_id, project_id) {
    return new Promise((resolve, reject) => {
      Report.count({
        where: {
          user_id: user_id
        },
        include: [
          {
            model: TestCase,
            as: "testcase",
            attributes: [],
            required: true,
            where: {
              project_id: project_id
            }
          },
          {
            model: Status,
            as: "status",
            attributes: [],
            required: true,
            where: {
              title: "Passed"
            }
          }
        ]
      }).then(count => {
        if (count) {
          resolve(count);
        } else {
          resolve(0);
        }
      });
    });
  },
  getCountReportsFailedForUser: async function(user_id, project_id) {
    return new Promise((resolve, reject) => {
      Report.count({
        where: {
          user_id: user_id
        },
        include: [
          {
            model: TestCase,
            as: "testcase",
            attributes: [],
            required: true,
            where: {
              project_id: project_id
            }
          },
          {
            model: Status,
            as: "status",
            attributes: [],
            required: true,
            where: {
              title: "Failed"
            }
          }
        ]
      }).then(count => {
        if (count) {
          resolve(count);
        } else {
          resolve(0);
        }
      });
    });
  },
  getMostReportsUsers: async function(project_id, limit) {
    return new Promise((resolve, reject) => {
      Report.findAll({
        attributes: ["user_id", [sequelize.fn("COUNT", "user_id"), "countReports"]],
        group: ["user.first_name", "user.last_name", "reports.user_id", "user.id"],
        include: [
          {
            model: TestCase,
            as: "testcase",
            attributes: [],
            required: true,
            where: {
              project_id: project_id
            }
          },
          {
            model: Status,
            as: "status",
            attributes: [],
            required: true
          },
          {
            model: User,
            as: "user",
            attributes: ["id", "first_name", "last_name"],
            required: true
          }
        ],
        order: [["count", "DESC"]],
        limit: limit
      }).then(reports => {
        var reportsArr = Array();
        if (reports.length > 0) {
          for (var i = 0; i < reports.length; i++) {
            var ReportObj = {};
            ReportObj.total = Number(reports[i].dataValues.countReports);
            ReportObj.user_id = reports[i].dataValues.user_id;
            ReportObj.title = reports[i].user.first_name.concat(" ").concat(reports[i].user.last_name);
            reportsArr.push(ReportObj);
            if (i == reports.length - 1) {
              resolve(reportsArr);
            }
          }
        } else {
          resolve([]);
        }
      });
    });
  },
  getMostTestcasesUsers: async function(project_id, limit) {
    return new Promise((resolve, reject) => {
      TestCase.findAll({
        attributes: ["user_id", [sequelize.fn("COUNT", "user_id"), "countTestcases"]],
        group: ["user.first_name", "user.last_name", "user.id", "testcases.user_id"],
        where: {
          project_id: project_id,
          deprecated: false
        },
        include: [
          {
            model: User,
            attributes: ["id", "first_name", "last_name"],
            required: true,
            as: "user"
          }
        ],
        order: [["count", "DESC"]],
        limit: limit
      }).then(testcases => {
        var testcasesArr = Array();
        if (testcases.length > 0) {
          for (var i = 0; i < testcases.length; i++) {
            var ReportObj = {};
            ReportObj.total = Number(testcases[i].dataValues.countTestcases);
            ReportObj.title = testcases[i].user.first_name.concat(" ").concat(testcases[i].user.last_name);
            testcasesArr.push(ReportObj);
            if (i == testcases.length - 1) {
              resolve(testcasesArr);
            }
          }
        } else {
          resolve([]);
        }
      });
    });
  },

  getMostVersionsFailed: async function(project_id, limit) {
    return new Promise((resolve, reject) => {
      Version.findAll({
        include: [
          {
            model: ReportSetup,
            as: "reportsetups",
            attributes: ["version_id"],
            required: true,
            where: {
              version_id: {
                [Op.ne]: null
              }
            },
            include: [
              {
                model: Report,
                as: "reports",
                attributes: ["id"],
                required: true,

                include: [
                  {
                    model: Status,
                    as: "status",
                    attributes: ["id", "title"],
                    required: true
                  },
                  {
                    model: TestCase,
                    as: "testcase",
                    attributes: ["id", "project_id"],
                    required: true,
                    where: {
                      project_id: project_id
                    }
                  }
                ]
              }
            ]
          }
        ]
      }).then(testcases => {
        if (testcases.length > 0) {
          var testcasesArr = Array();
          for (var i = 0; i < testcases.length; i++) {
            var TCobj = {};
            TCobj.title = testcases[i].version;
            TCobj.total = testcases[i].reportsetups.length;
            var countPassed = 0;
            var countFailed = 0;
            for (var j = 0; j < testcases[i].reportsetups.length; j++) {
              if (testcases[i].reportsetups[j].reports.status.title == "Passed") {
                countPassed = countPassed + 1;
              } else {
                countFailed = countFailed + 1;
              }
            }
            TCobj.passed = countPassed;
            TCobj.failed = countFailed;
            testcasesArr.push(TCobj);
            if (i == testcases.length - 1) {
              testcasesArr.sort(function(a, b) {
                var keyA = a.failed,
                  keyB = b.failed;
                if (keyA > keyB) return -1;
                if (keyA < keyB) return 1;
                return 0;
              });
              resolve(testcasesArr);
            }
          }
        } else {
          resolve([]);
        }
      });
    });
  }
};
