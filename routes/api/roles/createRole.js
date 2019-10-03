const Router = require("express").Router;
const passport = require("passport");
const Role = require("../../../models/role");
const validateRoleInput = require("../../../validation/role").validateRoleInput;

// @route POST api/roles/role
// @desc Create new role
// @access Private
module.exports = Router({ mergeParams: true }).post(
  "/roles/role",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validateRoleInput(req.body);

    // Check Validation
    if (!isValid) {
      return res.status(400).json(errors);
    }

    // Get fields
    const roleFields = {};
    if (req.body.title) roleFields.title = req.body.title;

    async function checkIfRoleWithSameTItleExists() {
      return new Promise((resolve, reject) => {
        Role.findOne({
          where: {
            title: req.body.title
          }
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

    async function createRole() {
      return new Promise((resolve, reject) => {
        Role.create({
          title: roleFields.title
        }).then(role => {
          if (role) {
            resolve(role);
          } else {
            resolve(false);
          }
        });
      });
    }

    async function returnCreatedRole(addedRole) {
      return new Promise((resolve, reject) => {
        if (addedRole) {
          Role.findOne({
            attributes: ["id", "title"],
            where: {
              id: addedRole.id
            }
          }).then(role => {
            if (role) {
              resolve(role);
            } else {
              resolve(false);
            }
          });
        }
      });
    }

    (async () => {
      var roleExists = await checkIfRoleWithSameTItleExists();
      if (roleExists) {
        res.status(400).json({ error: "Role already exists" });
      } else {
        var createdRole = await createRole();
        if (createdRole) {
          let createdRoleObj = await returnCreatedRole(createdRole);
          res.json(createdRoleObj);
        } else {
          res.status(500).json({ error: "An error occured while creating role" });
        }
      }
    })();
  }
);
