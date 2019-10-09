const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const User = require("../models/user");
const Role = require("../models/role");
const Project = require("../models/project");

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
  // find and return projects
  getProjects: async function(searchTerm, user) {
    return new Promise((resolve, reject) => {
      var whereStatement = {};
      var userProjectsIds = [];
      user.projects.forEach(project => {
        userProjectsIds.push(project.id);
      });
      if (searchTerm) {
        whereStatement.title = {
          [Op.iLike]: "%" + searchTerm + "%"
        };
      }
      whereStatement.id = {
        [Op.in]: userProjectsIds
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
        order: [["id", "DESC"], [User, "id", "ASC"]]
      })
        .then(projects => {
          resolve(projects);
        })
        .catch(err => console.log(err));
    });
  }
};
