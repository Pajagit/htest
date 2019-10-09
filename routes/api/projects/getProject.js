const Router = require("express").Router;
const passport = require("passport");
const User = require("../../../models/user");
const Role = require("../../../models/role");
const Project = require("../../../models/project");
var UserService = require("../../../services/user");

// @route GET api/projects/project/:id
// @desc Get project by id
// @access Private
module.exports = Router({ mergeParams: true }).get(
  "/projects/project/:id",
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
    }
    // find and return project
    async function returnProject() {
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
            id: req.params.id
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
    }

    (async () => {
      var canGetProject = await UserService.canGetProject(req.user, req.params.id);
      if (!canGetProject) {
        return res.status(403).json({ message: "Forbiden" });
      }
      var project = await returnProject();

      var projectWithRole = {};
      projectWithRole.id = project.id;
      projectWithRole.title = project.title;
      projectWithRole.image_url = project.image_url;
      projectWithRole.description = project.description;
      projectWithRole.deleted = project.deleted;
      projectWithRole.project_manager = project.project_manager;
      projectWithRole.url = project.url;
      projectWithRole.jira_url = project.jira_url;

      var projectRole = await findUserRole(project.users);
      projectWithRole.users = projectRole.sort((a, b) => b.id - a.id);

      if (projectWithRole) {
        res.status(200).json(projectWithRole);
      }
    })();
  }
);
