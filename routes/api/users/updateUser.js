const Router = require("express").Router;
const passport = require("passport");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const getLocalTimestamp = require("../../../utils/dateFunctions").getLocalTimestamp;
const User = require("../../../models/user");
const Project = require("../../../models/project");
const Role = require("../../../models/role");
const validateUserInput = require("../../../validation/user").validateUserInput;

// @route PUT api/users/user/:id
// @desc Update user by id
// @access private
module.exports = Router({ mergeParams: true }).put(
  "/users/user/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    if (isNaN(req.params.id)) {
      res.status(400).json({ error: "User id is not valid number" });
    } else {
      const UserFields = {};

      // check if user exists
      async function checkIfUserExist() {
        return new Promise((resolve, reject) => {
          User.findOne({
            where: {
              id: req.params.id
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
      }

      // check if same user exists
      async function checkIfUserWithSameMailExist() {
        return new Promise((resolve, reject) => {
          User.findOne({
            where: {
              email: req.body.email,
              id: {
                [Op.ne]: req.params.id
              }
            }
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
      }

      async function updateUser(InputUserData) {
        return new Promise((resolve, reject) => {
          User.update(InputUserData, {
            where: { id: req.params.id },
            returning: true,
            plain: true
          })
            .then(UpdatedUser => {
              resolve(req.params.id);
            })
            .catch(err => console.log(err));
        });
      }

      async function createInputDateFromPayload(user) {
        return new Promise((resolve, reject) => {
          if (req.body.position) UserFields.position = req.body.position;
          if (!user.last_login) {
            UserFields.email = req.body.email ? req.body.email : null;
            UserFields.first_name = req.body.first_name ? req.body.first_name : null;
            UserFields.last_name = req.body.last_name ? req.body.last_name : null;
          } else {
            UserFields.email = user.email;
            UserFields.first_name = user.first_name;
            UserFields.last_name = user.last_name;
          }
          UserFields.image_url = user.image_url;
          resolve(UserFields);
        });
      }

      async function returnUpdatedUser(updatedUser) {
        return new Promise((resolve, reject) => {
          if (updatedUser) {
            User.findOne({
              where: {
                id: updatedUser
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
      }

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

      (async () => {
        var user = await checkIfUserExist();
        var last_login = user.last_login;
        if (!user) {
          res.status(404).json({ error: "User doesn't exist" });
        } else {
          let InputUserData = await createInputDateFromPayload(user);
          const { errors, isValid } = validateUserInput(InputUserData, last_login, true);

          // Check Validation
          if (!isValid) {
            return res.status(400).json(errors);
          } else {
            if (req.body.email && !last_login) {
              let anotherUserSameMail = await checkIfUserWithSameMailExist();
              if (anotherUserSameMail) {
                return res.status(400).json({ email: "User alredy exists" });
              }
            }
            let updatedUser = await updateUser(InputUserData);
            let user = await returnUpdatedUser(updatedUser);
            var userWithRole = {};
            userWithRole.id = user.id;
            userWithRole.email = user.email;
            userWithRole.first_name = user.first_name;
            userWithRole.last_name = user.last_name;
            userWithRole.position = user.position;
            userWithRole.image_url = user.image_url;
            userWithRole.active = user.active;
            userWithRole.last_login = user.last_login;

            userWithRole.projects = await findUserRole(user.projects);

            if (userWithRole) {
              res.status(200).json(userWithRole);
            }
          }
        }
      })();
    }
  }
);
