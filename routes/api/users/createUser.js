const Router = require("express").Router;
const passport = require("passport");
const User = require("../../../models/user");

const validateUserInput = require("../../../validation/user").validateUserInput;

// @route POST api/users/user
// @desc Create new user
// @access Private
module.exports = Router({ mergeParams: true }).post(
  "/users/user",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    // Get fields
    const userFields = {};

    userFields.email = req.body.email;
    userFields.first_name = req.body.first_name ? req.body.first_name : null;
    userFields.last_name = req.body.last_name ? req.body.last_name : null;
    userFields.position = req.body.position ? req.body.position : null;
    userFields.image_url = req.body.image_url ? req.body.image_url : null;

    async function checkIfUserExists() {
      return new Promise((resolve, reject) => {
        User.findOne({
          where: {
            email: req.body.email
          }
        }).then(user => {
          if (user) {
            resolve(user);
          } else {
            resolve(false);
          }
        });
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

    async function createUser() {
      return new Promise((resolve, reject) => {
        User.create(userFields).then(user => {
          if (user) {
            resolve(user);
          } else {
            resolve(false);
          }
        });
      });
    }

    async function returnCreatedUser(addedUser) {
      return new Promise((resolve, reject) => {
        if (addedUser) {
          User.findOne({
            attributes: ["id", "email", "first_name", "last_name", "position", "image_url", "last_login"],
            where: {
              id: addedUser.id
            }
          }).then(user => {
            if (user) {
              resolve(user);
            } else {
              resolve(false);
            }
          });
        }
      });
    }

    (async () => {
      const { errors, isValid } = validateUserInput(req.body, null, false);
      // Check Validation
      if (!isValid) {
        return res.status(400).json(errors);
      }
      var userExists = await checkIfUserExists();
      if (userExists) {
        res.status(400).json({ error: "User already exist" });
      } else {
        let createdUser = await createUser();
        if (createdUser) {
          let createdUserObj = await returnCreatedUser(createdUser);

          res.json(createdUserObj);
        } else {
          res.status(500).json({ error: "An error occured while creating user" });
        }
      }
    })();
  }
);
