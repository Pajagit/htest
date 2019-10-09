const Router = require("express").Router;
const passport = require("passport");
const User = require("../../../models/user");
const Role = require("../../../models/role");
const Project = require("../../../models/project");
const UserRoleProject = require("../../../models/userroleproject");
const validateUserProjectInput = require("../../../validation/user").validateUserProjectInput;
const UserService = require("../../../services/user");

// @route POST api/users/user/:id/project
// @desc Update user projects
// @access private
module.exports = Router({ mergeParams: true }).post(
  "/users/user/:id/project",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    if (isNaN(req.params.id)) {
      res.status(400).json({ error: "User id is not valid number" });
    } else {
      const { errors, isValid } = validateUserProjectInput(req.body);

      // Check Validation
      if (!isValid) {
        return res.status(400).json(errors);
      }
      // check if user exists
      async function checkIfUserExist() {
        return new Promise((resolve, reject) => {
          User.findOne({
            where: {
              id: req.params.id
            },
            attributes: ["id"]
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
      }

      // check if project exists
      async function checkIfProjectExists() {
        return new Promise((resolve, reject) => {
          Project.findOne({
            where: {
              id: req.body.project_id
            },
            attributes: ["id"]
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
      }

      // check if role exists
      async function checkIfRoleExists() {
        return new Promise((resolve, reject) => {
          Role.findOne({
            where: {
              id: req.body.role_id
            },
            attributes: ["id"]
          })
            .then(role => {
              if (role) {
                resolve(true);
              } else {
                resolve(false);
              }
            })
            .catch(err => console.log(err));
        });
      }

      async function checkIfProjectExistsForUser() {
        return new Promise((resolve, reject) => {
          UserRoleProject.findOne({
            where: {
              user_id: req.params.id,
              project_id: req.body.project_id
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
      }

      async function updateProject() {
        return new Promise((resolve, reject) => {
          var userProjectRole = {
            role_id: req.body.role_id
          };
          UserRoleProject.update(userProjectRole, {
            where: {
              user_id: req.params.id,
              project_id: req.body.project_id
            },
            returning: true,
            plain: true
          })
            .then(project => {
              resolve(true);
            })
            .catch(err => console.log(err));
        });
      }

      async function addProject() {
        return new Promise((resolve, reject) => {
          var userProject = {
            user_id: req.params.id,
            role_id: req.body.role_id,
            project_id: req.body.project_id
          };

          UserRoleProject.create(userProject).then(projects => {
            resolve(true);
          });
        });
      }

      (async () => {
        var user = await checkIfUserExist();
        if (!user) {
          res.status(404).json({ error: "User doesn't exist" });
        } else {
          var project = await checkIfProjectExists();
          var role = await checkIfRoleExists();
          if (!project) {
            res.status(404).json({ error: "Project doesn't exist" });
          }
          if (!role) {
            res.status(404).json({ error: "Role doesn't exist" });
          }
          var canAddProjectToUser = await UserService.addRemoveProjectFromUser(req.user, req.body.project_id);
          if (!canAddProjectToUser) {
            return res.status(403).json({ message: "Forbiden" });
          }

          if (project && role) {
            var hasProject = await checkIfProjectExistsForUser();
            if (hasProject) {
              var projectUpdated = await updateProject();
            } else {
              var projectAdded = await addProject();
            }

            if (projectUpdated || projectAdded) {
              res.status(200).json({ success: "Project added successfully" });
            }
          }
        }
      })();
    }
  }
);
