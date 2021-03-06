const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const User = require("../models/user");
const Role = require("../models/role");
const Project = require("../models/project");
const ProjectSettings = require("../models/projectsettings");
const ReportSettings = require("../models/reportsetting");

const UserSettings = require("../models/usersettings");
const UserRoleProject = require("../models/userroleproject");
const paginate = require("../utils/pagination").paginate;

module.exports = {
  checkIfProjectExist: async function(id) {
    return new Promise((resolve, reject) => {
      Project.findOne({
        where: {
          id: id
        }
      }).then(project => {
        if (project) {
          resolve(true);
        } else {
          resolve(false);
        }
      });
    });
  },
  checkIfProjectWithSameTitleExists: async function(title, id) {
    return new Promise((resolve, reject) => {
      var whereStatement = {};
      whereStatement.title = title;
      if (id) {
        whereStatement.id = {
          [Op.ne]: id
        };
      }
      Project.findOne({
        where: whereStatement
      })
        .then(project => {
          if (project) {
            resolve(true);
          } else {
            resolve(false);
          }
        })
        .catch(err => console.log(err));
    });
  },
  getSettings: async function(project_id, user) {
    return new Promise((resolve, reject) => {
      ProjectSettings.findOne({
        attributes: [
          "testcase_groups",
          "testcase_users",
          "testcase_date_from",
          "testcase_date_to",
          "testcase_search_term",
          "project_id",
          "testcase_view_mode",
          "testcase_show_filters"
        ],
        where: {
          user_id: user.id,
          project_id: project_id
        }
      }).then(settings => {
        var settings_obj = {};
        settings_obj.groups = [];
        settings_obj.users = [];
        settings_obj.date_from = null;
        settings_obj.date_to = null;
        settings_obj.search_term = null;
        settings_obj.view_mode = 1;
        settings_obj.show_filters = true;
        settings_obj.project_id = null;

        if (settings) {
          settings_obj.groups = settings.testcase_groups;
          settings_obj.users = settings.testcase_users;
          settings_obj.date_from = settings.testcase_date_from;
          settings_obj.date_to = settings.testcase_date_to;
          settings_obj.search_term = settings.testcase_search_term;
          settings_obj.view_mode = settings.testcase_view_mode;
          settings_obj.show_filters = settings.testcase_show_filters;
          settings_obj.project_id = settings.project_id;
        }
        resolve(settings_obj);
      });
    });
  },
  getReportSettings: async function(project_id, user) {
    return new Promise((resolve, reject) => {
      ReportSettings.findOne({
        attributes: [
          "groups",
          "users",
          "statuses",
          "devices",
          "simulators",
          "operatingsystems",
          "environments",
          "versions",
          "browsers",
          "date_from",
          "date_to",
          "search_term",
          "project_id",
          "view_mode",
          "show_filters"
        ],
        where: {
          user_id: user.id,
          project_id: project_id
        }
      }).then(settings => {
        var settings_obj = {};
        settings_obj.groups = [];
        settings_obj.users = [];
        settings_obj.statuses = [];
        settings_obj.devices = [];
        settings_obj.simulators = [];
        settings_obj.browsers = [];
        settings_obj.operatingsystems = [];
        settings_obj.environments = [];
        settings_obj.versions = [];
        settings_obj.date_from = null;
        settings_obj.date_to = null;
        settings_obj.search_term = null;
        settings_obj.view_mode = 1;
        settings_obj.show_filters = true;
        settings_obj.project_id = null;

        if (settings) {
          settings_obj.groups = settings.groups;
          settings_obj.users = settings.users;
          settings_obj.statuses = settings.statuses;
          settings_obj.devices = settings.devices;
          settings_obj.simulators = settings.simulators;
          settings_obj.operatingsystems = settings.operatingsystems;
          settings_obj.environments = settings.environments;
          settings_obj.versions = settings.versions;
          settings_obj.browsers = settings.browsers;
          settings_obj.date_from = settings.date_from;
          settings_obj.date_to = settings.date_to;
          settings_obj.search_term = settings.search_term;
          settings_obj.view_mode = settings.view_mode;
          settings_obj.show_filters = settings.show_filters;
          settings_obj.project_id = settings.project_id;
        }
        resolve(settings_obj);
      });
    });
  },
  updateProjectSettings: async function(user_id, project_id, settings_obj) {
    return new Promise((resolve, reject) => {
      ProjectSettings.findOne({
        where: {
          user_id: user_id,
          project_id: project_id
        }
      }).then(settings => {
        if (settings) {
          ProjectSettings.update(settings_obj, {
            where: {
              id: settings.id,
              user_id: user_id,
              project_id: project_id
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
          settings_obj.project_id = project_id;
          ProjectSettings.create(settings_obj).then(created_setting => {
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
  updateReportSettings: async function(user_id, project_id, settings_obj) {
    return new Promise((resolve, reject) => {
      ReportSettings.findOne({
        where: {
          user_id: user_id,
          project_id: project_id
        }
      }).then(settings => {
        if (settings) {
          ReportSettings.update(settings_obj, {
            where: {
              id: settings.id,
              user_id: user_id,
              project_id: project_id
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
          settings_obj.project_id = project_id;
          ReportSettings.create(settings_obj).then(created_setting => {
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
  deactivateProject: async function(id) {
    return new Promise((resolve, reject) => {
      Project.update(
        {
          deleted: true,
          deleted_date: new Date()
        },
        {
          where: {
            id: id
          }
        }
      ).then(project => {
        if (project) {
          resolve(true);
        } else {
          resolve(false);
        }
      });
    });
  },
  findUserRole: async function(users) {
    return new Promise((resolve, reject) => {
      if (users.length > 0) {
        var projectUsers = [];
        var usersProcessed = 0;
        users.forEach(user => {
          var projectUser = {};
          Role.findOne({
            attributes: ["title"],
            where: {
              id: user.userroleprojects.role_id
            }
          }).then(role => {
            if (role) {
              projectUser.role = {};
              projectUser.role.id = user.userroleprojects.role_id;
              projectUser.role.title = role.title;
              projectUser.first_name = user.first_name;
              projectUser.last_name = user.last_name;
              projectUser.email = user.email;
              projectUser.id = user.id;
              projectUsers.push(projectUser);
              usersProcessed++;
              if (usersProcessed === users.length) {
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
  getProjects: async function(search_term, user, page, pageSize) {
    return new Promise((resolve, reject) => {
      var whereStatement = {};
      if (!user.superadmin) {
        var userProjectsIds = [];
        user.projects.forEach(project => {
          userProjectsIds.push(project.id);
        });
        whereStatement.id = {
          [Op.in]: userProjectsIds
        };
      }
      if (search_term) {
        whereStatement.title = {
          [Op.iLike]: "%" + search_term + "%"
        };
      }
      Project.findAndCountAll({
        attributes: ["id"],
        where: whereStatement,
        ...paginate({ page, pageSize }),
        order: [["id", "DESC"]]
      }).then(project_ids => {
        var ids = [];
        project_ids.rows.forEach(row => {
          ids.push(row.id);
        });
        var pages = 1;
        if (project_ids.count > 0) {
          pages = Math.ceil(project_ids.count / pageSize);
        }
        whereStatement.id = {
          [Op.in]: ids
        };
        Project.findAll({
          attributes: [
            "id",
            "title",
            "description",
            "started_at",
            "ended_at",
            "image_url",
            "project_manager",
            "url",
            "jira_url"
          ],
          where: whereStatement,
          include: [
            {
              model: User,
              attributes: ["id", "first_name", "last_name", "email"],
              through: {
                attributes: ["role_id"]
              },
              as: "users",
              required: false
            }
          ],
          order: [
            ["id", "DESC"],
            [User, "id", "ASC"]
          ]
        })
          .then(projects => {
            resolve({ projects, pages, page: Number(page) });
          })
          .catch(err => console.log(err));
      });
    });
  },
  getAllProjects: async function(search_term, user) {
    return new Promise((resolve, reject) => {
      var whereStatement = {};
      if (!user.superadmin) {
        var userProjectsIds = [];
        user.projects.forEach(project => {
          userProjectsIds.push(project.id);
        });
        whereStatement.id = {
          [Op.in]: userProjectsIds
        };
      }
      if (search_term) {
        whereStatement.title = {
          [Op.iLike]: "%" + search_term + "%"
        };
      }
      Project.findAndCountAll({
        attributes: [
          "id",
          "title",
          "description",
          "started_at",
          "ended_at",
          "image_url",
          "project_manager",
          "url",
          "jira_url"
        ],
        where: whereStatement,
        include: [
          {
            model: User,
            attributes: ["id", "first_name", "last_name", "email"],
            through: {
              attributes: ["role_id"]
            },
            as: "users",
            required: false
          }
        ],
        order: [
          ["id", "DESC"],
          [User, "id", "ASC"]
        ]
      })
        .then(projects_and_count => {
          var page = 1;
          var pages = 1;
          var projects = projects_and_count.rows;
          resolve({ projects, pages, page });
        })
        .catch(err => console.log(err));
    });
  },
  getProjectById: async function(id) {
    return new Promise((resolve, reject) => {
      Project.findOne({
        attributes: [
          "id",
          "title",
          "description",
          "started_at",
          "ended_at",
          "image_url",
          "project_manager",
          "deleted",
          "url",
          "jira_url"
        ],
        where: {
          id: id
        },
        include: [
          {
            model: User,
            attributes: ["id", "first_name", "last_name", "email"],
            through: {
              attributes: ["role_id"]
            },
            as: "users",
            required: false
          }
        ],
        order: [
          ["id", "DESC"],
          [User, "id", "ASC"]
        ]
      })
        .then(project => {
          resolve(project);
        })
        .catch(err => console.log(err));
    });
  },
  updateProject: async function(projectFields, id) {
    return new Promise((resolve, reject) => {
      Project.update(projectFields, {
        where: { id: id },
        returning: true,
        plain: true
      }).then(project => {
        if (project) {
          resolve(project);
        } else {
          resolve(false);
        }
      });
    });
  },
  returnUpdatedProject: async function(projectId) {
    return new Promise((resolve, reject) => {
      if (projectId) {
        Project.findOne({
          attributes: [
            "id",
            "title",
            "description",
            "started_at",
            "ended_at",
            "image_url",
            "project_manager",
            "url",
            "jira_url"
          ],
          where: {
            id: projectId
          }
        }).then(project => {
          if (project) {
            resolve(project);
          } else {
            resolve(false);
          }
        });
      }
    });
  },
  createProject: async function(projectFields) {
    return new Promise((resolve, reject) => {
      Project.create({
        title: projectFields.title,
        description: projectFields.description,
        started_at: projectFields.started_at,
        ended_at: projectFields.ended_at,
        image_url: projectFields.image_url,
        project_manager: projectFields.project_manager,
        jira_url: projectFields.jira_url,
        url: projectFields.url
      }).then(project => {
        if (project) {
          resolve(project);
        } else {
          resolve(false);
        }
      });
    });
  },
  addProjectToSuperadminUsers: async function(users, projectId, role_id) {
    return new Promise((resolve, reject) => {
      var userObjects = [];
      users.forEach(user => {
        var user = {
          user_id: user.id,
          role_id: role_id,
          project_id: projectId
        };
        userObjects.push(user);
      });

      UserRoleProject.bulkCreate(userObjects).then(projects => {
        resolve(true);
      });
    });
  },
  updateSettingsProject: async function(project_id, user) {
    return new Promise((resolve, reject) => {
      UserSettings.update(
        { project_id: project_id },
        {
          where: {
            user_id: user.id
          }
        }
      ).then(settings => {
        if (settings) {
          resolve(true);
        } else {
          resolve(false);
        }
      });
    });
  }
};
