const Router = require("express").Router;
const passport = require("passport");
const User = require("../../../models/user");
const Project = require("../../../models/project");
const Role = require("../../../models/role");
const getLocalTimestamp = require("../../../utils/dateFunctions").getLocalTimestamp;

// @route GET api/users/user/:id
// @desc Get one user by id
// @access private
module.exports = Router({ mergeParams: true }).get(
  "/users/user/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    if (isNaN(req.params.id)) {
      res.status(400).json({ error: "User id is not valid number" });
    } else {
      const errors = {};

      async function findUserRole(projects) {
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
                  projectUser.role = {};
                  projectUser.role.id = project.userroleprojects.role_id;
                  projectUser.role.title = role.title;
                  projectUser.id = project.id;
                  projectUser.title = project.title;
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
      }

      async function returnUser() {
        return new Promise((resolve, reject) => {
          User.findOne({
            where: {
              id: req.params.id
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
                errors.nouser = "user doesn't exist";
                res.status(404).json(errors);
              } else {
                user.last_login = getLocalTimestamp(user.last_login);
                resolve(user);
              }
            })
            .catch(err => res.status(404).json(err));
        });
      }

      (async () => {
        var user = await returnUser();

        var userWithRole = {};
        userWithRole.id = user.id;
        userWithRole.email = user.email;
        userWithRole.first_name = user.first_name;
        userWithRole.last_name = user.last_name;
        userWithRole.position = user.position;
        userWithRole.image_url = user.image_url;
        userWithRole.active = user.active;
        userWithRole.last_login = user.last_login;

        var projectsRoles = await findUserRole(user.projects);
        userWithRole.projects = projectsRoles.sort((a, b) => b.id - a.id);

        if (userWithRole) {
          res.status(200).json(userWithRole);
        }
      })();
    }
  }
);
