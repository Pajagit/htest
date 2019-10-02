const Router = require("express").Router;
const passport = require("passport");
const User = require("../../../models/user");
const UserRoleProject = require("../../../models/userroleproject");

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

      async function checkIfProjectExists() {
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
          var hasProject = await checkIfProjectExists();
          if (hasProject) {
            var projectUpdated = await updateProject();
          } else {
            var projectAdded = await addProject();
          }

          if (projectUpdated || projectAdded) {
            res.status(200).json({ success: "Project added successfully" });
          }
        }
      })();
    }
  }
);
