const Router = require("express").Router;
const passport = require("passport");
const getLocalTimestamp = require("../../../utils/dateFunctions").getLocalTimestamp;
const User = require("../../../models/user");
const Project = require("../../../models/project");

const validateUserInputOnUpdate = require("../../../validation/user").validateUserInputOnUpdate;

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
      const { errors, isValid } = validateUserInputOnUpdate(req.body);
      // Check Validation
      if (!isValid) {
        return res.status(400).json(errors);
      }

      // Get fields
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

      async function updateUser() {
        return new Promise((resolve, reject) => {
          User.update(UserFields, {
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
                    attributes: []
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

      (async () => {
        var user = await checkIfUserExist();
        var last_login = user.last_login;
        if (!user) {
          res.status(404).json({ error: "User doesn't exist" });
        } else {
          if (!last_login) {
            if (req.body.email) UserFields.email = req.body.email;
            if (req.body.first_name) UserFields.first_name = req.body.first_name;
            if (req.body.last_name) UserFields.last_name = req.body.last_name;
            if (req.body.image_url) UserFields.image_url = req.body.image_url;
          }
          if (req.body.position) UserFields.position = req.body.position;

          let updatedUser = await updateUser();

          let user = await returnUpdatedUser(updatedUser);

          res.json(user);
        }
      })();
    }
  }
);
