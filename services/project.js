const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const User = require("../models/user");
const Role = require("../models/role");
const Project = require("../models/project");
const UserRoleProject = require("../models/userroleproject");

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
  getProjects: async function(searchTerm, user) {
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
      if (searchTerm) {
        whereStatement.title = {
          [Op.iLike]: "%" + searchTerm + "%"
        };
      }
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
        order: [["id", "DESC"], [User, "id", "ASC"]]
      })
        .then(projects => {
          resolve(projects);
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
        order: [["id", "DESC"], [User, "id", "ASC"]]
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
  }
};
