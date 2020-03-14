const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const User = require("../models/user");
const Project = require("../models/project");
const UserRoleProject = require("../models/userroleproject");
const Role = require("../models/role");
const Report = require("../models/report");
const Testcase = require("../models/testcase");
const UserSettings = require("../models/usersettings");
const ProjectSettings = require("../models/projectsettings");
const getLocalTimestamp = require("../utils/dateFunctions").getLocalTimestamp;

module.exports = {
  findUserRole: async function(projects) {
    return new Promise((resolve, reject) => {
      if (projects.length > 0) {
        var project_users = [];
        var projects_processed = 0;
        projects.forEach(project => {
          var project_user = {};
          Role.findOne({
            attributes: ["title", "id"],
            where: {
              id: project.userroleprojects.role_id
            }
          }).then(role => {
            if (role) {
              project_user.role = {};
              project_user.role.title = role.title;
              project_user.role.id = role.id;
              project_user.title = project.title;
              project_user.id = project.id;
              project_users.push(project_user);
              projects_processed++;
              if (projects_processed === projects.length) {
                resolve(project_users);
              }
            }
          });
        });
      } else {
        resolve([]);
      }
    });
  },
  userIsSuperadmin: async function(user, role_id) {
    return new Promise((resolve, reject) => {
      UserRoleProject.findOne({
        attributes: ["id"],
        where: {
          user_id: user.id,
          role_id: role_id
        }
      }).then(role => {
        if (role) {
          resolve(true);
        } else {
          resolve(false);
        }
      });
    });
  },
  getUsersWithTestCases: async function(project_id) {
    return new Promise((resolve, reject) => {
      var includeArray = [
        {
          model: Project,
          attributes: ["id", "title"],
          through: {
            attributes: []
          },
          as: "projects",
          required: false
        }
      ];
      var whereCondition = {
        deprecated: false
      };
      if (project_id) {
        whereCondition.project_id = project_id;
      }
      includeArray.push({
        model: Testcase,
        where: whereCondition,
        attributes: [],
        required: true
      });
      User.findAll({
        attributes: ["id", "email", "first_name", "last_name", "position", "image_url", "active", "last_login"],

        include: includeArray,
        order: [
          ["email", "ASC"],
          [Project, "id", "ASC"]
        ]
      }).then(users => {
        if (users) {
          users.forEach(user => {
            user.last_login = getLocalTimestamp(user.last_login);
          });
          resolve(users);
        } else {
          resolve([]);
        }
      });
    });
  },
  getUsersWithReports: async function(project_id) {
    return new Promise((resolve, reject) => {
      var whereCondition = {};
      var includeArray = [
        {
          model: Project,
          attributes: ["id", "title"],
          through: {
            attributes: []
          },
          as: "projects",
          required: false
        }
      ];
      // if (project_id) {
      //   whereCondition.project_id = project_id;
      // }
      includeArray.push({
        model: Report,
        where: whereCondition,
        attributes: [],
        required: true,
        include: [{ model: Testcase, as: "testcase", where: { project_id: project_id }, required: true }]
      });
      User.findAll({
        attributes: ["id", "email", "first_name", "last_name", "position", "image_url", "active", "last_login"],

        include: includeArray,
        order: [
          ["email", "ASC"],
          [Project, "id", "ASC"]
        ]
      }).then(users => {
        if (users) {
          users.forEach(user => {
            user.last_login = getLocalTimestamp(user.last_login);
          });
          resolve(users);
        } else {
          resolve([]);
        }
      });
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
  getLastVisitedProject: async function(user_id) {
    return new Promise((resolve, reject) => {
      UserSettings.findOne({
        attributes: ["project_id"],
        where: {
          user_id: user_id
        }
      }).then(user_setting => {
        if (user_setting) {
          resolve(user_setting.project_id);
        } else {
          resolve(null);
        }
      });
    });
  },
  getProjectsInScope: async function(user_id) {
    return new Promise((resolve, reject) => {
      Project.findAll({
        attributes: ["id"],
        include: [
          {
            model: User,
            where: { id: user_id },
            attributes: ["id"],
            through: {
              attributes: ["role_id"]
            },
            as: "users",
            required: true
          }
        ]
      }).then(projects => {
        if (projects) {
          resolve(projects);
        } else {
          resolve(false);
        }
      });
    });
  },
  getUserById: async function(id) {
    return new Promise((resolve, reject) => {
      User.findOne({
        where: {
          id: id
        },
        attributes: ["id", "email", "first_name", "last_name", "position", "image_url", "active", "last_login"],
        include: [
          {
            model: Project,
            attributes: ["id", "title"],
            through: {
              attributes: ["role_id"]
            },
            as: "projects",
            required: false
          }
        ],
        order: [[Project, "id", "DESC"]],
        plain: true
      })
        .then(user => {
          if (!user) {
            resolve(false);
          } else {
            user.last_login = getLocalTimestamp(user.last_login);
            resolve(user);
          }
        })
        .catch(err => res.status(404).json(err));
    });
  },
  createUser: async function(user_fields) {
    return new Promise((resolve, reject) => {
      User.create(user_fields).then(user => {
        if (user) {
          resolve(user);
        } else {
          resolve(false);
        }
      });
    });
  },
  setAsSuperadmin: async function(superadmin, user, role_id, update) {
    return new Promise((resolve, reject) => {
      UserRoleProject.findOne({
        where: {
          user_id: user.id,
          role_id: role_id
        }
      }).then(userroleproject => {
        if (!update && superadmin) {
          UserRoleProject.create({
            user_id: user.id,
            role_id: role_id
          }).then(userroleproject => {
            if (userroleproject) {
              resolve(true);
            } else {
              resolve(false);
            }
          });
        } else {
          if (update) {
            if (userroleproject && !superadmin) {
              UserRoleProject.destroy({
                where: {
                  user_id: user.id,
                  role_id: role_id
                }
              }).then(returned_rows => {
                if (returned_rows === 1) {
                  resolve(true);
                } else {
                  resolve(false);
                }
              });
            } else {
              if (!userroleproject && superadmin) {
                UserRoleProject.create({
                  user_id: user.id,
                  role_id: role_id
                }).then(userroleproject => {
                  if (userroleproject) {
                    resolve(true);
                  } else {
                    resolve(false);
                  }
                });
              } else {
                resolve(true);
              }
            }
          } else {
            resolve(true);
          }
        }
      });
    });
  },
  createInputDateFromPayload: async function(body_data, user) {
    return new Promise((resolve, reject) => {
      const user_fields = {};
      if (body_data.position) user_fields.position = body_data.position;
      if (!user.last_login) {
        user_fields.email = body_data.email ? body_data.email : null;
        user_fields.first_name = body_data.first_name ? body_data.first_name : null;
        user_fields.last_name = body_data.last_name ? body_data.last_name : null;
      } else {
        user_fields.email = user.email;
        user_fields.first_name = user.first_name;
        user_fields.last_name = user.last_name;
      }
      user_fields.image_url = user.image_url;
      user_fields.superadmin = body_data.superadmin;
      resolve(user_fields);
    });
  },
  returnCreatedUser: async function(created_user) {
    return new Promise((resolve, reject) => {
      if (created_user) {
        User.findOne({
          attributes: ["id", "email", "first_name", "last_name", "position", "image_url", "last_login"],
          where: {
            id: created_user.id
          }
        }).then(user => {
          if (user) {
            resolve(user);
          } else {
            resolve(false);
          }
        });
      }
    });
  },
  returnUpdatedUser: async function(updated_user) {
    return new Promise((resolve, reject) => {
      if (updated_user) {
        User.findOne({
          where: {
            id: updated_user.id
          },
          attributes: ["id", "email", "first_name", "last_name", "position", "image_url", "active", "last_login"],
          include: [
            {
              model: Project,
              attributes: ["id", "title"],
              through: {
                attributes: ["role_id"]
              },
              as: "projects",
              required: false
            }
          ],
          order: [[Project, "id", "DESC"]]
        })
          .then(user => {
            if (user) {
              user.last_login = getLocalTimestamp(user.last_login);
              resolve(user);
            } else {
              resolve(false);
            }
          })
          .catch(err => console.log(err));
      }
    });
  },
  checkIfUserWithSameMailExist: async function(email, id) {
    return new Promise((resolve, reject) => {
      var where_statement = {};
      where_statement.email = email;
      if (id) {
        where_statement.id = {
          [Op.ne]: id
        };
      }
      User.findOne({
        where: where_statement
      })
        .then(user => {
          if (user) {
            resolve(true);
          } else {
            resolve(false);
          }
        })
        .catch(err => console.log(err));
    });
  },

  updateUser: async function(input_user_data, id) {
    return new Promise((resolve, reject) => {
      User.update(input_user_data, {
        where: { id: id },
        returning: true,
        plain: true
      })
        .then(updated_user => {
          if (updated_user) {
            resolve(updated_user);
          }
        })
        .catch(err => console.log(err));
    });
  },
  checkIfUserExistById: async function(id) {
    return new Promise((resolve, reject) => {
      User.findOne({
        where: {
          id: id
        },
        attributes: ["id", "email", "first_name", "last_name", "position", "image_url", "active", "last_login"]
      })
        .then(user => {
          if (user) {
            resolve(user);
          } else {
            resolve(false);
          }
        })
        .catch(err => console.log(err));
    });
  },
  checkIfProjectExistsForUser: async function(user_id, project_id) {
    return new Promise((resolve, reject) => {
      UserRoleProject.findOne({
        where: {
          user_id: user_id,
          project_id: project_id
        },
        attributes: ["id"]
      })
        .then(project => {
          if (project) {
            resolve(project);
          } else {
            resolve(false);
          }
        })
        .catch(err => console.log(err));
    });
  },
  removeProject: async function(user_id, project_id) {
    return new Promise((resolve, reject) => {
      UserRoleProject.destroy({
        where: {
          user_id: user_id,
          project_id: project_id
        }
      }).then(count => {
        if (count === 1) {
          resolve(true);
        } else {
          resolve(false);
        }
      });
    });
  },
  updateProject: async function(user_id, role_id, project_id) {
    return new Promise((resolve, reject) => {
      var user_project_role = {
        role_id: role_id
      };
      UserRoleProject.update(user_project_role, {
        where: {
          user_id: user_id,
          project_id: project_id
        },
        returning: true,
        plain: true
      })
        .then(userroleproject => {
          if (userroleproject) {
            resolve(true);
          } else {
            resolve(false);
          }
        })
        .catch(err => console.log(err));
    });
  },
  addProject: async function(user_id, role_id, project_id) {
    return new Promise((resolve, reject) => {
      var user_project = {
        user_id: user_id,
        role_id: role_id,
        project_id: project_id
      };

      UserRoleProject.create(user_project).then(projects => {
        if (projects) {
          resolve(true);
        } else {
          resolve(false);
        }
      });
    });
  },
  getSettings: async function(user_id) {
    return new Promise((resolve, reject) => {
      UserSettings.findOne({
        attributes: ["testcase_view_mode", "testcase_show_filters", "project_id"],
        where: {
          user_id: user_id
        }
      }).then(settings => {
        if (settings) {
          var settings_obj = {};
          settings_obj = {};
          if (settings) {
            settings_obj.view_mode = settings.testcase_view_mode;
            settings_obj.show_filters = settings.testcase_show_filters;
            settings_obj.project_id = settings.project_id;
          }
          resolve(settings_obj);
        } else {
          resolve(false);
        }
      });
    });
  },
  updateSettings: async function(user_id, settings_obj) {
    return new Promise((resolve, reject) => {
      UserSettings.findOne({
        where: {
          user_id: user_id
        }
      }).then(settings => {
        if (settings) {
          UserSettings.update(settings_obj, {
            where: {
              id: settings.id,
              user_id: user_id
            },
            returning: true,
            plain: true
          }).then(updated_settings => {
            if (updated_settings) {
              resolve(true);
            } else {
              resolve(false);
            }
          });
        } else {
          settings_obj.user_id = user_id;
          UserSettings.create(settings_obj).then(created_setting => {
            if (created_setting) {
              resolve(true);
            } else {
              resolve(false);
            }
          });
        }
      });
    });
  },

  canGetProject: async function(user, projectId) {
    return new Promise((resolve, reject) => {
      var allowedRoles = ["Superadmin", "Project Administrator", "QA", "Viewer"];
      var projectIdsArray = [];
      var allowed = false;
      if (user.superadmin == true) {
        allowed = true;
      } else {
        user.projects.forEach(project => {
          projectIdsArray.push(project.id);
          if (project.id == projectId && allowedRoles.includes(project.role.title)) {
            allowed = true;
          }
        });
      }
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
      if (user.superadmin == true) {
        allowed = true;
      } else {
        user.projects.forEach(project => {
          projectIdsArray.push(project.id);
          if (project.id == projectId && allowedRoles.includes(project.role.title)) {
            allowed = true;
          }
        });
      }
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
      if (user.superadmin == true) {
        allowed = true;
      } else {
        user.projects.forEach(project => {
          if (allowedRoles.includes(project.role.title) && project.id == projectId) {
            allowed = true;
          }
        });
      }
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
      if (user.superadmin == true) {
        allowed = true;
      } else {
        user.projects.forEach(project => {
          if (project.id == projectId && allowedRoles.includes(project.role.title)) {
            allowed = true;
          }
        });
      }
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
      if (user.superadmin == true) {
        allowed = true;
      } else {
        user.projects.forEach(project => {
          if (allowedRoles.includes(project.role.title)) {
            allowed = true;
          }
        });
      }
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
      if (user.superadmin == true) {
        allowed = true;
      } else {
        user.projects.forEach(project => {
          if (allowedRoles.includes(project.role.title) && project.id == projectId) {
            allowed = true;
          }
        });
      }
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
      if (user.superadmin == true) {
        allowed = true;
      } else {
        user.projects.forEach(project => {
          if (allowedRoles.includes(project.role.title)) {
            allowed = true;
          }
        });
      }
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
      if (user.superadmin == true) {
        allowed = true;
      } else {
        user.projects.forEach(project => {
          if (allowedRoles.includes(project.role.title)) {
            allowed = true;
          }
        });
      }
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
      if (user.superadmin == true) {
        allowed = true;
      } else {
        user.projects.forEach(project => {
          if (project.id == projectId && allowedRoles.includes(project.role.title)) {
            allowed = true;
          }
        });
      }
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
      if (user.superadmin == true) {
        allowed = true;
      } else {
        user.projects.forEach(project => {
          if (project.id == projectId && allowedRoles.includes(project.role.title)) {
            allowed = true;
          }
        });
      }
      if (allowed) {
        resolve(true);
      } else {
        resolve(false);
      }
    });
  },
  canCreateUpdateDeleteSimulator: async function(user, projectId) {
    return new Promise((resolve, reject) => {
      var allowedRoles = ["Superadmin", "Project Administrator"];

      var allowed = false;
      if (user.superadmin == true) {
        allowed = true;
      } else {
        user.projects.forEach(project => {
          if (project.id == projectId && allowedRoles.includes(project.role.title)) {
            allowed = true;
          }
        });
      }
      if (allowed) {
        resolve(true);
      } else {
        resolve(false);
      }
    });
  },
  canCreateUpdateDeleteDevice: async function(user) {
    return new Promise((resolve, reject) => {
      var allowed = false;
      if (user.superadmin == true) {
        allowed = true;
      }
      if (allowed) {
        resolve(true);
      } else {
        resolve(false);
      }
    });
  },
  canGetDeviceAndSimulator: async function(user) {
    return new Promise((resolve, reject) => {
      var allowedRoles = ["Superadmin", "Project Administrator", "QA"];

      var allowed = false;
      if (user.superadmin == true) {
        allowed = true;
      } else {
        user.projects.forEach(project => {
          if (allowedRoles.includes(project.role.title)) {
            allowed = true;
          }
        });
      }
      if (allowed) {
        resolve(true);
      } else {
        resolve(false);
      }
    });
  },
  canGetOS: async function(user, projectId) {
    return new Promise((resolve, reject) => {
      var allowedRoles = ["Superadmin", "Project Administrator", "QA"];

      var allowed = false;
      if (user.superadmin == true) {
        allowed = true;
      } else {
        user.projects.forEach(project => {
          if (project.id == projectId && allowedRoles.includes(project.role.title)) {
            allowed = true;
          }
        });
      }
      if (allowed) {
        resolve(true);
      } else {
        resolve(false);
      }
    });
  },
  canGetBrowsers: async function(user, projectId) {
    return new Promise((resolve, reject) => {
      var allowedRoles = ["Superadmin", "Project Administrator", "QA"];

      var allowed = false;
      if (user.superadmin == true) {
        allowed = true;
      } else {
        user.projects.forEach(project => {
          if (project.id == projectId && allowedRoles.includes(project.role.title)) {
            allowed = true;
          }
        });
      }
      if (allowed) {
        resolve(true);
      } else {
        resolve(false);
      }
    });
  },
  canCreateEditBrowsers: async function(user, projectId) {
    return new Promise((resolve, reject) => {
      var allowedRoles = ["Superadmin", "Project Administrator"];

      var allowed = false;
      if (user.superadmin == true) {
        allowed = true;
      } else {
        user.projects.forEach(project => {
          if (project.id == projectId && allowedRoles.includes(project.role.title)) {
            allowed = true;
          }
        });
      }
      if (allowed) {
        resolve(true);
      } else {
        resolve(false);
      }
    });
  },
  canGetVersions: async function(user, projectId) {
    return new Promise((resolve, reject) => {
      var allowedRoles = ["Superadmin", "Project Administrator", "QA"];

      var allowed = false;
      if (user.superadmin == true) {
        allowed = true;
      } else {
        user.projects.forEach(project => {
          if (project.id == projectId && allowedRoles.includes(project.role.title)) {
            allowed = true;
          }
        });
      }
      if (allowed) {
        resolve(true);
      } else {
        resolve(false);
      }
    });
  },
  canCreateEditVersions: async function(user, projectId) {
    return new Promise((resolve, reject) => {
      var allowedRoles = ["Superadmin", "Project Administrator"];

      var allowed = false;
      if (user.superadmin == true) {
        allowed = true;
      } else {
        user.projects.forEach(project => {
          if (project.id == projectId && allowedRoles.includes(project.role.title)) {
            allowed = true;
          }
        });
      }
      if (allowed) {
        resolve(true);
      } else {
        resolve(false);
      }
    });
  },
  canCreateEditOS: async function(user, projectId) {
    return new Promise((resolve, reject) => {
      var allowedRoles = ["Superadmin", "Project Administrator"];

      var allowed = false;
      if (user.superadmin == true) {
        allowed = true;
      } else {
        user.projects.forEach(project => {
          if (project.id == projectId && allowedRoles.includes(project.role.title)) {
            allowed = true;
          }
        });
      }
      if (allowed) {
        resolve(true);
      } else {
        resolve(false);
      }
    });
  },
  canGetEnvironments: async function(user, projectId) {
    return new Promise((resolve, reject) => {
      var allowedRoles = ["Superadmin", "Project Administrator", "QA"];

      var allowed = false;
      if (user.superadmin == true) {
        allowed = true;
      } else {
        user.projects.forEach(project => {
          if (project.id == projectId && allowedRoles.includes(project.role.title)) {
            allowed = true;
          }
        });
      }
      if (allowed) {
        resolve(true);
      } else {
        resolve(false);
      }
    });
  },
  canCreateEditEnvironments: async function(user, projectId) {
    return new Promise((resolve, reject) => {
      var allowedRoles = ["Superadmin", "Project Administrator"];

      var allowed = false;
      if (user.superadmin == true) {
        allowed = true;
      } else {
        user.projects.forEach(project => {
          if (project.id == projectId && allowedRoles.includes(project.role.title)) {
            allowed = true;
          }
        });
      }
      if (allowed) {
        resolve(true);
      } else {
        resolve(false);
      }
    });
  },

  canEditTestSetup: async function(user, projectId) {
    return new Promise((resolve, reject) => {
      var allowedRoles = ["Superadmin", "Project Administrator"];

      var allowed = false;
      if (user.superadmin == true) {
        allowed = true;
      } else {
        user.projects.forEach(project => {
          if (project.id == projectId && allowedRoles.includes(project.role.title)) {
            allowed = true;
          }
        });
      }
      if (allowed) {
        resolve(true);
      } else {
        resolve(false);
      }
    });
  },
  canGetTestSetup: async function(user, projectId) {
    return new Promise((resolve, reject) => {
      var allowedRoles = ["Superadmin", "Project Administrator", "QA"];

      var allowed = false;
      if (user.superadmin == true) {
        allowed = true;
      } else {
        user.projects.forEach(project => {
          if (project.id == projectId && allowedRoles.includes(project.role.title)) {
            allowed = true;
          }
        });
      }
      if (allowed) {
        resolve(true);
      } else {
        resolve(false);
      }
    });
  },
  canCreateReport: async function(user, projectId) {
    return new Promise((resolve, reject) => {
      var allowedRoles = ["Superadmin", "Project Administrator", "QA"];

      var allowed = false;
      if (user.superadmin == true) {
        allowed = true;
      } else {
        user.projects.forEach(project => {
          if (project.id == projectId && allowedRoles.includes(project.role.title)) {
            allowed = true;
          }
        });
      }
      if (allowed) {
        resolve(true);
      } else {
        resolve(false);
      }
    });
  },

  canGetReports: async function(user, projectId) {
    return new Promise((resolve, reject) => {
      var allowedRoles = ["Superadmin", "Project Administrator", "QA", "Viewer"];

      var allowed = false;
      if (user.superadmin == true) {
        allowed = true;
      } else {
        user.projects.forEach(project => {
          if (project.id == projectId && allowedRoles.includes(project.role.title)) {
            allowed = true;
          }
        });
      }
      if (allowed) {
        resolve(true);
      } else {
        resolve(false);
      }
    });
  }
};
