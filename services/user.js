const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const User = require("../models/user");
const Project = require("../models/project");
const Group = require("../models/group");
const Role = require("../models/role");

module.exports = {
  findUserRole: async function(projects) {
    return new Promise((resolve, reject) => {
      if (projects.length > 0) {
        var projectUsers = [];
        var projectsProcessed = 0;
        projects.forEach(project => {
          var projectUser = {};
          Role.findOne({
            attributes: ["title"],
            where: {
              id: project.userroleprojects.role_id
            }
          }).then(role => {
            if (role) {
              projectUser.role = role.title;
              projectUser.id = project.id;
              projectUsers.push(projectUser);
              projectsProcessed++;
              if (projectsProcessed === projects.length) {
                resolve(projectUsers);
              }
            }
          });
        });
      } else {
        resolve([]);
      }
    });
  },
  findAllSuperadminUsers: async function(role_id) {
    return new Promise((resolve, reject) => {
      User.findAll({
        include: [
          {
            model: Project,
            attributes: ["title"],
            through: {
              attributes: ["role_id"],
              where: { role_id: role_id }
            },
            as: "projects",
            required: true
          }
        ]
      })
        .then(users => {
          if (users) {
            resolve(users);
          } else {
            resolve(false);
          }
        })
        .catch(err => console.log(err));
    });
  },
  canGetProject: async function(user, projectId) {
    return new Promise((resolve, reject) => {
      var allowedRoles = ["Superadmin", "Project Administrator", "QA", "Viewer"];
      var projectIdsArray = [];
      var allowed = false;
      user.projects.forEach(project => {
        projectIdsArray.push(project.id);
        if (project.id == projectId && allowedRoles.includes(project.role)) {
          allowed = true;
        }
      });
      if (allowed) {
        resolve(true);
      } else {
        resolve(false);
      }
    });
  },

  canCreateEditDeleteGroup: async function(user, projectId) {
    return new Promise((resolve, reject) => {
      var allowedRoles = ["Superadmin", "Project Administrator", "QA"];
      var projectIdsArray = [];
      var allowed = false;
      user.projects.forEach(project => {
        projectIdsArray.push(project.id);
        if (project.id == projectId && allowedRoles.includes(project.role)) {
          allowed = true;
        }
      });
      if (allowed) {
        resolve(true);
      } else {
        resolve(false);
      }
    });
  },

  canDeleteProject: async function(user, projectId) {
    return new Promise((resolve, reject) => {
      var allowedRoles = ["Superadmin"];
      var allowed = false;
      user.projects.forEach(project => {
        if (allowedRoles.includes(project.role) && project.id == projectId) {
          allowed = true;
        }
      });
      if (allowed) {
        resolve(true);
      } else {
        resolve(false);
      }
    });
  },
  canUpdateProject: async function(user, projectId) {
    return new Promise((resolve, reject) => {
      var allowedRoles = ["Superadmin", "Project Administrator"];
      var allowed = false;
      user.projects.forEach(project => {
        if (project.id == projectId && allowedRoles.includes(project.role)) {
          allowed = true;
        }
      });
      if (allowed) {
        resolve(true);
      } else {
        resolve(false);
      }
    });
  },
  canCreateProject: async function(user) {
    return new Promise((resolve, reject) => {
      var allowedRoles = ["Superadmin"];
      var allowed = false;
      user.projects.forEach(project => {
        if (allowedRoles.includes(project.role)) {
          allowed = true;
        }
      });
      if (allowed) {
        resolve(true);
      } else {
        resolve(false);
      }
    });
  },
  addRemoveProjectFromUser: async function(user, projectId) {
    return new Promise((resolve, reject) => {
      var allowedRoles = ["Superadmin", "Project Administrator"];
      var allowed = false;
      user.projects.forEach(project => {
        if (allowedRoles.includes(project.role) && project.id == projectId) {
          allowed = true;
        }
      });
      if (allowed) {
        resolve(true);
      } else {
        resolve(false);
      }
    });
  },
  getCreateUpdateUser: async function(user) {
    return new Promise((resolve, reject) => {
      var allowedRoles = ["Superadmin"];
      var allowed = false;
      user.projects.forEach(project => {
        if (allowedRoles.includes(project.role)) {
          allowed = true;
        }
      });
      if (allowed) {
        resolve(true);
      } else {
        resolve(false);
      }
    });
  },
  getUsers: async function(user) {
    return new Promise((resolve, reject) => {
      var allowedRoles = ["Superadmin", "Project Administrator", "QA", "Viewer"];
      var allowed = false;
      user.projects.forEach(project => {
        if (allowedRoles.includes(project.role)) {
          allowed = true;
        }
      });
      if (allowed) {
        resolve(true);
      } else {
        resolve(false);
      }
    });
  },
  canCreateUpdateTestCase: async function(user, projectId) {
    return new Promise((resolve, reject) => {
      var allowedRoles = ["Superadmin", "Project Administrator", "QA"];
      var allowed = false;
      user.projects.forEach(project => {
        if (project.id == projectId && allowedRoles.includes(project.role)) {
          allowed = true;
        }
      });
      if (allowed) {
        resolve(true);
      } else {
        resolve(false);
      }
    });
  },
  getTestCase: async function(user, projectId) {
    return new Promise((resolve, reject) => {
      var allowedRoles = ["Superadmin", "Project Administrator", "QA", "Viewer"];
      var allowed = false;
      user.projects.forEach(project => {
        if (project.id == projectId && allowedRoles.includes(project.role)) {
          allowed = true;
        }
      });
      if (allowed) {
        resolve(true);
      } else {
        resolve(false);
      }
    });
  }
};