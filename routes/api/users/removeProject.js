const Router = require("express").Router;
const passport = require("passport");
const User = require("../../../models/user");
const UserRoleProject = require("../../../models/userroleproject");
const UserService = require("../../../services/user");

// @route DELETE api/users/user/:id/project/:project_id
// @desc Update user projects
// @access private
module.exports = Router({ mergeParams: true }).delete(
  "/users/user/:id/project/:project_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    if (isNaN(req.params.id)) {
      res.status(400).json({ error: "User id is not valid number" });
    } else if (isNaN(req.params.project_id)) {
      res.status(400).json({ error: "Project id is not valid number" });
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
              project_id: req.params.project_id
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

      async function removeProject() {
        return new Promise((resolve, reject) => {
          UserRoleProject.destroy({
            where: {
              user_id: req.params.id,
              project_id: req.params.project_id
            }
          }).then(a => {
            if (a === 1) {
              resolve(true);
            } else {
              resolve(false);
            }
          });
        });
      }

      (async () => {
        var user = await checkIfUserExist();
        if (!user) {
          res.status(404).json({ error: "User doesn't exist" });
        } else {
          var canRemoveProjectToUser = await UserService.addRemoveProjectFromUser(req.user, req.params.project_id);
          if (!canRemoveProjectToUser) {
            return res.status(403).json({ message: "Forbiden" });
          }
          var hasProject = await checkIfProjectExists();
          if (hasProject) {
            var projectDeleted = await removeProject();
            if (projectDeleted) {
              res.status(200).json({ success: "Deleted Successfully" });
            }
          } else {
            res.status(404).json({ message: "Project has already been deleted or was never assigned to the user" });
          }
        }
      })();
    }
  }
);
