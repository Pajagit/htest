const Router = require("express").Router;
const passport = require("passport");
const User = require("../../../models/user");
const Role = require("../../../models/role");
const Project = require("../../../models/project");

// @route GET api/projects
// @desc Get all projects
// @access Private
module.exports = Router({ mergeParams: true }).get(
  "/projects",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    async function findUserRole(users) {
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
    }
    // find and return projects
    async function returnProjects() {
      return new Promise((resolve, reject) => {
        Project.findAll({
          attributes: ["id", "title", "image_url", "project_manager", "url", "jira_url"],
          where: {
            deleted: false
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
          .then(projects => {
            resolve(projects);
          })
          .catch(err => console.log(err));
      });
    }

    (async () => {
      var projects = await returnProjects();
      var projectsWithRoles = [];
      for (var i = 0; i < projects.length; i++) {
        var projectWithRole = {};
        projectWithRole.id = projects[i].id;
        projectWithRole.title = projects[i].title;
        projectWithRole.image_url = projects[i].image_url;
        projectWithRole.project_manager = projects[i].project_manager;
        projectWithRole.url = projects[i].url;
        projectWithRole.jira_url = projects[i].jira_url;
        projectWithRole.users = await findUserRole(projects[i].users);
        projectsWithRoles.push(projectWithRole);
      }
      if (projectsWithRoles) {
        res.status(200).json(projectsWithRoles);
      }
    })();
  }
);
