const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const TestSetupItem = require("../models/testsetupitems");
const Project = require("../models/project");
const ProjectTestSetupItem = require("../models/projecttestsetupitem");

module.exports = {
  getAlltestSetupItems: async function(project_id) {
    return new Promise((resolve, reject) => {
      TestSetupItem.findAll({
        attributes: ["id", "title"],
        include: [
          {
            model: Project,
            attributes: ["id"],
            through: {
              attributes: []
            },
            as: "projects",
            required: false
          }
        ],
        order: [["title", "ASC"]]
      }).then(testSetupItems => {
        if (testSetupItems) {
          var projectTestSetup = Array();
          testSetupItems.forEach(testSetupItem => {
            var projectTestSetupItem = {};
            projectTestSetupItem.id = testSetupItem.id;
            projectTestSetupItem.title = testSetupItem.title;
            var used = false;
            if (testSetupItem.projects.length > 0) {
              testSetupItem.projects.forEach(project => {
                if (project.id == project_id) {
                  used = true;
                }
              });
            }
            projectTestSetupItem.used = used;
            projectTestSetup.push(projectTestSetupItem);
          });

          resolve(projectTestSetup);
        } else {
          resolve(false);
        }
      });
    });
  },
  setAsUsed: async function(project_id, testsetupitem_id, used) {
    return new Promise((resolve, reject) => {
      if (used == "true") {
        var testSetupFields = {};
        testSetupFields.project_id = project_id;
        testSetupFields.testsetupitem_id = testsetupitem_id;
        ProjectTestSetupItem.findOne({
          attributes: ["id"],
          where: {
            project_id: project_id,
            testsetupitem_id: testsetupitem_id
          }
        }).then(testsetup => {
          if (!testsetup) {
            ProjectTestSetupItem.create(testSetupFields).then(projecttestsetup => {
              if (projecttestsetup) {
                resolve(true);
              } else {
                resolve(false);
              }
            });
          } else {
            resolve(true);
          }
        });
      } else {
        ProjectTestSetupItem.findOne({
          attributes: ["id"],
          where: {
            project_id: project_id,
            testsetupitem_id: testsetupitem_id
          }
        }).then(testsetup => {
          if (testsetup) {
            ProjectTestSetupItem.destroy({
              where: {
                id: testsetup.id
              }
            }).then(removedRows => {
              if (removedRows === 1) {
                resolve(true);
              } else {
                resolve(false);
              }
            });
          } else {
            resolve(true);
          }
        });
      }
    });
  },
  checkIfTestSetupItemExist: async function(id) {
    return new Promise((resolve, reject) => {
      TestSetupItem.findOne({
        where: {
          id: id
        }
      }).then(testsetupitem => {
        if (testsetupitem) {
          resolve(true);
        } else {
          resolve(false);
        }
      });
    });
  },
  getProjecttestSetupItems: async function(project_id) {
    return new Promise((resolve, reject) => {
      TestSetupItem.findAll({
        attributes: ["id", "title"],
        include: [
          {
            model: Project,
            attributes: ["id"],
            through: {
              attributes: []
            },
            as: "projects",
            required: true,
            where: { id: project_id }
          }
        ],
        order: [["title", "ASC"]]
      }).then(testSetupItems => {
        if (testSetupItems) {
          var projectTestSetup = Array();
          testSetupItems.forEach(testSetupItem => {
            var projectTestSetupItem = {};
            projectTestSetupItem.id = testSetupItem.id;
            projectTestSetupItem.title = testSetupItem.title;
            var used = false;
            if (testSetupItem.projects.length > 0) {
              testSetupItem.projects.forEach(project => {
                if (project.id == project_id) {
                  used = true;
                }
              });
            }
            projectTestSetupItem.used = used;
            projectTestSetup.push(projectTestSetupItem);
          });

          resolve(projectTestSetup);
        } else {
          resolve(false);
        }
      });
    });
  }
};
