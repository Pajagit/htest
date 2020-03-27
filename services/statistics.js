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
const Project = require("../models/project");
const ReportSetup = require("../models/reportsetup");
const Version = require("../models/version");
const Link = require("../models/link");
const UploadedFile = require("../models/uploadedfile");
const Group = require("../models/group");

module.exports = {
  getTotalTestcases: async function(start_date, end_date, project_id) {
    return new Promise((resolve, reject) => {
      var whereCondition = {};
      whereCondition.deprecated = false;
      if (project_id) {
        whereCondition.project_id = project_id;
      }
      if (start_date && end_date) {
        whereCondition.created_at = {
          [Op.gt]: start_date,
          [Op.lte]: end_date
        };
      }

      TestCase.count({
        attributes: [],
        where: whereCondition
      }).then(testcases => {
        if (testcases) {
          resolve(testcases);
        } else {
          resolve(0);
        }
      });
    });
  },

  getTotalReports: async function(start_date, end_date, project_id) {
    return new Promise((resolve, reject) => {
      var whereCondition = {};
      if (project_id) {
        whereCondition.project_id = project_id;
      }
      var whereCondReports = {};
      if (start_date && end_date) {
        whereCondReports.created_at = {
          [Op.gt]: start_date,
          [Op.lte]: end_date
        };
      }
      Report.count({
        attributes: [],
        where: whereCondReports,
        include: [
          {
            model: TestCase,
            as: "testcase",
            attributes: [],
            required: true,
            where: whereCondition
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
  getTotalReportsPassed: async function(start_date, end_date, project_id) {
    return new Promise((resolve, reject) => {
      var whereCondition = {};
      if (project_id) {
        whereCondition.project_id = project_id;
      }
      var whereCondReports = {};
      if (start_date && end_date) {
        whereCondReports.created_at = {
          [Op.gt]: start_date,
          [Op.lte]: end_date
        };
      }
      Report.count({
        attributes: [],
        where: whereCondReports,
        include: [
          {
            model: TestCase,
            as: "testcase",
            attributes: [],
            required: true,
            where: whereCondition
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
  getTotalReportsFailed: async function(start_date, end_date, project_id) {
    return new Promise((resolve, reject) => {
      var whereCondition = {};
      if (project_id) {
        whereCondition.project_id = project_id;
      }
      var whereCondReports = {};
      if (start_date && end_date) {
        whereCondReports.created_at = {
          [Op.gt]: start_date,
          [Op.lte]: end_date
        };
      }
      Report.count({
        attributes: [],
        where: whereCondReports,
        include: [
          {
            model: TestCase,
            as: "testcase",
            attributes: [],
            required: true,
            where: whereCondition
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
  getCountReportsPassed: async function(test_case_id, start_date, end_date) {
    return new Promise((resolve, reject) => {
      var whereReports = {};
      whereReports.test_case_id = test_case_id;
      if (start_date && end_date) {
        whereReports.created_at = {
          [Op.gt]: start_date,
          [Op.lte]: end_date
        };
      }
      Report.count({
        where: whereReports,
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
  getMostTestcasesFailed: async function(limit, start_date, end_date, project_id) {
    return new Promise((resolve, reject) => {
      var whereCondition = {};
      if (project_id) {
        whereCondition.project_id = project_id;
      }
      var whereReports = {};
      if (start_date && end_date) {
        whereReports.created_at = {
          [Op.gt]: start_date,
          [Op.lte]: end_date
        };
      }
      Report.findAll({
        attributes: [[sequelize.fn("COUNT", "test_case_id"), "countReports"]],
        where: whereReports,
        group: ["test_case_id", "testcase.title", "testcase.id"],
        include: [
          {
            model: TestCase,
            as: "testcase",
            attributes: ["title", "id"],
            required: true,
            where: whereCondition
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
  getCountReportsPassedForUser: async function(user_id, start_date, end_date, project_id) {
    return new Promise((resolve, reject) => {
      var whereCondition = {};
      if (project_id) {
        whereCondition.project_id = project_id;
      }
      var whereReports = {};
      whereReports.user_id = user_id;
      if (start_date && end_date) {
        whereReports.created_at = {
          [Op.gt]: start_date,
          [Op.lte]: end_date
        };
      }
      Report.count({
        where: whereReports,
        include: [
          {
            model: TestCase,
            as: "testcase",
            attributes: [],
            required: true,
            where: whereCondition
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
  getCountReportsFailedForUser: async function(user_id, start_date, end_date, project_id) {
    return new Promise((resolve, reject) => {
      var whereCondition = {};
      if (project_id) {
        whereCondition.project_id = project_id;
      }
      var whereReports = {};
      whereReports.user_id = user_id;
      if (start_date && end_date) {
        whereReports.created_at = {
          [Op.gt]: start_date,
          [Op.lte]: end_date
        };
      }
      Report.count({
        where: whereReports,
        include: [
          {
            model: TestCase,
            as: "testcase",
            attributes: [],
            required: true,
            where: whereCondition
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
  getMostReportsUsers: async function(limit, start_date, end_date, project_id) {
    return new Promise((resolve, reject) => {
      var whereCondition = {};
      if (project_id) {
        whereCondition.project_id = project_id;
      }
      var whereReports = {};
      if (start_date && end_date) {
        whereReports.created_at = {
          [Op.gt]: start_date,
          [Op.lte]: end_date
        };
      }
      Report.findAll({
        attributes: ["user_id", [sequelize.fn("COUNT", "user_id"), "countReports"]],
        where: whereReports,
        group: ["user.first_name", "user.last_name", "reports.user_id", "user.id"],
        include: [
          {
            model: TestCase,
            as: "testcase",
            attributes: [],
            required: true,
            where: whereCondition
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
  getMostTestcasesUsers: async function(limit, start_date, end_date, project_id) {
    return new Promise((resolve, reject) => {
      var whereCondition = {};
      if (project_id) {
        whereCondition.project_id = project_id;
      }
      whereCondition.deprecated = false;
      if (start_date && end_date) {
        whereCondition.created_at = {
          [Op.gt]: start_date,
          [Op.lte]: end_date
        };
      }
      TestCase.findAll({
        attributes: ["user_id", [sequelize.fn("COUNT", "user_id"), "countTestcases"]],
        group: ["user.first_name", "user.last_name", "user.id", "testcases.user_id"],
        where: whereCondition,
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

  getMostVersionsFailed: async function(limit, start_date, end_date, project_id) {
    return new Promise((resolve, reject) => {
      var whereCondition = {};
      if (project_id) {
        whereCondition.project_id = project_id;
      }
      var whereReports = {};
      if (start_date && end_date) {
        whereReports.created_at = {
          [Op.gt]: start_date,
          [Op.lte]: end_date
        };
      }
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
                where: whereReports,
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
                    where: whereCondition
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
  },
  getTotalReportsFailedAnnual: async function(startDate, EndDate, project_id) {
    return new Promise((resolve, reject) => {
      var whereCondition = {};
      if (project_id) {
        whereCondition.project_id = project_id;
      }
      Report.count({
        attributes: [],
        where: {
          created_at: {
            [Op.between]: [startDate, EndDate]
          }
        },
        include: [
          {
            model: TestCase,
            as: "testcase",
            attributes: [],
            required: true,
            where: whereCondition
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
  getTotalReportsPassedAnnual: async function(startDate, EndDate, project_id) {
    return new Promise((resolve, reject) => {
      var whereCondition = {};
      if (project_id) {
        whereCondition.project_id = project_id;
      }
      Report.count({
        attributes: [],
        where: {
          created_at: {
            [Op.between]: [startDate, EndDate]
          }
        },
        include: [
          {
            model: TestCase,
            as: "testcase",
            attributes: [],
            required: true,
            where: whereCondition
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
  getTotalReportsAnnual: async function(startDate, EndDate, project_id) {
    return new Promise((resolve, reject) => {
      var whereCondition = {};
      if (project_id) {
        whereCondition.project_id = project_id;
      }
      Report.count({
        attributes: [],
        where: {
          created_at: {
            [Op.between]: [startDate, EndDate]
          }
        },
        include: [
          {
            model: TestCase,
            as: "testcase",
            attributes: [],
            required: true,
            where: whereCondition
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
  getMostActiveProjects: async function(limit, start_date, end_date) {
    var whereReports = {};
    if (start_date && end_date) {
      whereReports.created_at = {
        [Op.gt]: start_date,
        [Op.lte]: end_date
      };
    }
    return new Promise((resolve, reject) => {
      Project.findAll({
        attributes: ["title", [sequelize.fn("COUNT", "testcases.id"), "count"], "created_at"],
        group: ["projects.id"],
        include: [
          {
            model: TestCase,
            attributes: [],
            required: true,
            include: [
              {
                model: Report,
                where: whereReports,
                attributes: [],
                required: true,
                as: "reports"
              }
            ]
          }
        ],
        order: [["count", "DESC"]]
      }).then(testcases => {
        resObj = {};
        var testcasesArr = Array();
        if (testcases.length > 0) {
          var totalFrequency = 0;
          for (var i = 0; i < testcases.length; i++) {
            var TCobj = {};
            TCobj.title = testcases[i].title;
            TCobj.created_at = testcases[i].created_at;
            TCobj.count = testcases[i].dataValues.count;
            var now = new Date();
            var periodPerProject = Math.ceil((now - testcases[i].created_at) / 86400000);
            TCobj.period = periodPerProject;
            TCobj.frequency = TCobj.count / TCobj.period;

            testcasesArr.push(TCobj);
            if (i == testcases.length - 1) {
              testcasesArr.sort(function(a, b) {
                var keyA = a.frequency,
                  keyB = b.frequency;
                if (keyA > keyB) return -1;
                if (keyA < keyB) return 1;
                return 0;
              });
              resObj.projects = testcasesArr.slice(0, limit);
              resObj.projects.forEach(proj => {
                totalFrequency = totalFrequency + proj.frequency;
              });
              resObj.totalFrequency = totalFrequency;
              console.log(totalFrequency);

              var projectsRes = Array();
              for (var j = 0; j < resObj.projects.length; j++) {
                var projectObj = {};
                projectObj.title = resObj.projects[j].title;
                projectObj.percentage = Math.round((resObj.projects[j].frequency / resObj.totalFrequency) * 1000) / 10;
                projectsRes.push(projectObj);
                if (j == resObj.projects.length - 1) {
                  resolve(projectsRes);
                }
              }
            }
          }
        } else {
          resolve([]);
        }
      });
    });
  },
  getMostActiveTestcases: async function(limit, start_date, end_date, project_id) {
    return new Promise((resolve, reject) => {
      var whereReports = {};
      if (start_date && end_date) {
        whereReports.created_at = {
          [Op.gt]: start_date,
          [Op.lte]: end_date
        };
      }
      TestCase.findAll({
        attributes: ["title", [sequelize.fn("COUNT", "reports.id"), "count"], "created_at"],
        group: ["testcases.id"],
        where: {
          project_id: project_id
        },
        required: true,
        include: [
          {
            model: Report,
            attributes: [],
            where: whereReports,
            required: true,
            as: "reports"
          }
        ]
      }).then(testcases => {
        resObj = {};
        var testcasesArr = Array();
        if (testcases.length > 0) {
          var totalFrequency = 0;
          for (var i = 0; i < testcases.length; i++) {
            var TCobj = {};
            TCobj.title = testcases[i].title;
            TCobj.created_at = testcases[i].created_at;
            TCobj.count = testcases[i].dataValues.count;
            var now = new Date();
            var periodPerTc = Math.ceil((now - testcases[i].created_at) / 86400000);

            TCobj.period = periodPerTc;
            TCobj.frequency = TCobj.count / TCobj.period;

            testcasesArr.push(TCobj);
            if (i == testcases.length - 1) {
              testcasesArr.sort(function(a, b) {
                var keyA = a.frequency,
                  keyB = b.frequency;
                if (keyA > keyB) return -1;
                if (keyA < keyB) return 1;
                return 0;
              });
              resObj.testcases = testcasesArr.slice(0, limit);
              resObj.testcases.forEach(tc => {
                totalFrequency = totalFrequency + tc.frequency;
              });
              resObj.totalFrequency = totalFrequency;

              var tcRes = Array();
              for (var j = 0; j < resObj.testcases.length; j++) {
                var testcaseObj = {};
                testcaseObj.title = resObj.testcases[j].title;
                testcaseObj.percentage =
                  Math.round((resObj.testcases[j].frequency / resObj.totalFrequency) * 1000) / 10;
                tcRes.push(testcaseObj);
                if (j == resObj.testcases.length - 1) {
                  resolve(tcRes);
                }
              }
            }
          }
        } else {
          resolve([]);
        }
      });
    });
  },
  getMostProjectsTestcasesFailed: async function(limit, start_date, end_date) {
    return new Promise((resolve, reject) => {
      var whereReports = {};
      if (start_date && end_date) {
        whereReports.created_at = {
          [Op.gt]: start_date,
          [Op.lte]: end_date
        };
      }
      Project.findAll({
        include: [
          {
            model: TestCase,
            attributes: ["id"],
            required: true,
            include: [
              {
                model: Report,
                attributes: ["id"],
                where: whereReports,
                required: true,
                as: "reports",
                include: [
                  {
                    model: Status,
                    as: "status",
                    attributes: ["title"],
                    required: true
                  }
                ]
              }
            ]
          }
        ]
      }).then(projects => {
        var projectsArr = Array();
        if (projects.length > 0) {
          var projectsArr = Array();
          for (var i = 0; i < projects.length; i++) {
            var TCobj = {};
            TCobj.title = projects[i].title;
            var total = 0;
            var totalPassed = 0;
            var totalFailed = 0;

            if (projects[i].testcases) {
              projects[i].testcases.forEach(testcase => {
                if (testcase.reports) {
                  total = total + testcase.reports.length;
                  testcase.reports.forEach(report => {
                    if (report.status.title == "Passed") {
                      totalPassed = totalPassed + 1;
                    } else {
                      totalFailed = totalFailed + 1;
                    }
                  });
                }
              });
            }
            TCobj.total = total;
            TCobj.passed = totalPassed;
            TCobj.failed = totalFailed;

            projectsArr.push(TCobj);
            if (i == projects.length - 1) {
              projectsArr.sort(function(a, b) {
                var keyA = a.failed,
                  keyB = b.failed;
                if (keyA > keyB) return -1;
                if (keyA < keyB) return 1;
                return 0;
              });
              resolve(projectsArr);
            }
          }
          resolve(projects);
        } else {
          resolve([]);
        }
      });
    });
  },
  getMostProjectsTestcases: async function(start_date, end_date) {
    return new Promise((resolve, reject) => {
      var whereCond = {};
      whereCond.deprecated = false;
      if (start_date && end_date) {
        whereCond.created_at = {
          [Op.gt]: start_date,
          [Op.lte]: end_date
        };
      }
      Project.findAll({
        include: [
          {
            model: TestCase,
            attributes: ["id", "title"],
            required: false,
            where: whereCond
          }
        ]
      }).then(projects => {
        if (projects.length > 0) {
          var projectsArr = Array();
          for (var i = 0; i < projects.length; i++) {
            var TCS = {};
            TCS.title = projects[i].title;
            if (projects[i].testcases) {
              TCS.count = projects[i].testcases.length;
            } else {
              TCS.count = 0;
            }

            if (TCS.count > 0) {
              projectsArr.push(TCS);
            }

            if (i == projects.length - 1) {
              projectsArr.sort(function(a, b) {
                var keyA = a.count,
                  keyB = b.count;
                if (keyA > keyB) return -1;
                if (keyA < keyB) return 1;
                return 0;
              });
              resolve(projectsArr);
            }
          }
        } else {
          resolve([]);
        }
      });
    });
  }
};
