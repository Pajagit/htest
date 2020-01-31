const Router = require("express").Router;
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const passport = require("passport");
const Role = require("../../../models/role");

const validateRoleInput = require("../../../validation/role").validateRoleInput;

// @route PUT api/roles/role/:id
// @desc Update role by id
// @access private
module.exports = Router({ mergeParams: true }).put(
  "/roles/role/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    if (isNaN(req.params.id)) {
      res.status(400).json({ error: "Role id is not valid number" });
    } else {
      const { errors, isValid } = validateRoleInput(req.body);
      // Check Validation
      if (!isValid) {
        return res.status(400).json(errors);
      }

      // Get fields
      const roleFields = {};

      if (req.body.title) roleFields.title = req.body.title;

      // check if role exists
      async function checkIfRoleExist() {
        return new Promise((resolve, reject) => {
          Role.findOne({
            where: {
              id: req.params.id
            }
          }).then(role => {
            if (role) {
              resolve(true);
            } else {
              resolve(false);
            }
          });
        });
      }

      async function checkIfPRoleWithSameTItleExists() {
        return new Promise((resolve, reject) => {
          Role.findOne({
            where: {
              title: req.body.title,
              id: {
                [Op.ne]: req.params.id
              }
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

      async function updateRole() {
        return new Promise((resolve, reject) => {
          Role.update(roleFields, {
            where: { id: req.params.id },
            returning: true,
            plain: true
          }).then(role => {
            if (role) {
              resolve(true);
            } else {
              resolve(false);
            }
          });
        });
      }

      async function returnUpdatedRole(updatedRole) {
        return new Promise((resolve, reject) => {
          if (updatedRole) {
            Role.findOne({
              attributes: ["id", "title"],
              where: {
                id: req.params.id
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
        let checkEntityExistance = await checkIfRoleExist();
        if (!checkEntityExistance) {
          res.status(404).json({ error: "Role doesn't exist" });
        } else {
          var roleWithSameTitle = await checkIfPRoleWithSameTItleExists();
          if (roleWithSameTitle) {
            res.status(400).json({ error: "Role already exists" });
          } else {
            let updatedRole = await updateRole();
            let role = await returnUpdatedRole(updatedRole);
            res.json(role);
          }
        }
      })();
    }
  }
);
