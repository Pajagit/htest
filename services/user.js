const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const User = require("../models/user");
const Project = require("../models/project");
const UserRoleProject = require("../models/userroleproject");
const Role = require("../models/role");
const getLocalTimestamp = require("../utils/dateFunctions").getLocalTimestamp;

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
  createUser: async function(userFields) {
    return new Promise((resolve, reject) => {
      User.create(userFields).then(user => {
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
              }).then(returnedRows => {
                if (returnedRows === 1) {
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
  createInputDateFromPayload: async function(bodyData, user) {
    return new Promise((resolve, reject) => {
      const UserFields = {};
      if (bodyData.position) UserFields.position = bodyData.position;
      if (!user.last_login) {
        UserFields.email = bodyData.email ? bodyData.email : null;
        UserFields.first_name = bodyData.first_name ? bodyData.first_name : null;
        UserFields.last_name = bodyData.last_name ? bodyData.last_name : null;
      } else {
        UserFields.email = user.email;
        UserFields.first_name = user.first_name;
        UserFields.last_name = user.last_name;
      }
      UserFields.image_url = user.image_url;
      UserFields.superadmin = bodyData.superadmin;
      resolve(UserFields);
    });
  },
  returnCreatedUser: async function(updatedUser) {
    return new Promise((resolve, reject) => {
      if (updatedUser) {
        User.findOne({
          attributes: ["id", "email", "first_name", "last_name", "position", "image_url", "last_login"],
          where: {
            id: updatedUser.id
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
  returnUpdatedUser: async function(updatedUser) {
    return new Promise((resolve, reject) => {
      if (updatedUser) {
        User.findOne({
          where: {
            id: updatedUser.id
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
      var whereStatement = {};
      whereStatement.email = email;
      if (id) {
        whereStatement.id = {
          [Op.ne]: id
        };
      }
      User.findOne({
        where: whereStatement
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

  updateUser: async function(InputUserData, id) {
    return new Promise((resolve, reject) => {
      User.update(InputUserData, {
        where: { id: id },
        returning: true,
        plain: true
      })
        .then(UpdatedUser => {
          if (UpdatedUser) {
            resolve(UpdatedUser);
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
          if (project.id == projectId && allowedRoles.includes(project.role)) {
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
          if (project.id == projectId && allowedRoles.includes(project.role)) {
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
          if (allowedRoles.includes(project.role) && project.id == projectId) {
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
          if (project.id == projectId && allowedRoles.includes(project.role)) {
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
          if (allowedRoles.includes(project.role)) {
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
          if (allowedRoles.includes(project.role) && project.id == projectId) {
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
          if (allowedRoles.includes(project.role)) {
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
          if (allowedRoles.includes(project.role)) {
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
          if (project.id == projectId && allowedRoles.includes(project.role)) {
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
          if (project.id == projectId && allowedRoles.includes(project.role)) {
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
