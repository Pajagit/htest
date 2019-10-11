const Router = require("express").Router;
const passport = require("passport");
const Role = require("../../../models/role");
const RoleService = require("../../../services/role");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;

// @route GET api/roles
// @desc Get all roles
// @access Private
module.exports = Router({ mergeParams: true }).get(
  "/roles",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    (async () => {
      role_id = await RoleService.getSuperadminRoleId();
      Role.findAll({
        attributes: ["id", "title"],
        where: {
          id: {
            [Op.ne]: role_id
          }
        },
        order: [["id", "ASC"]]
      }).then(roles => {
        if (roles) {
          res.json(roles);
        } else {
          res.status(200);
        }
      });
    })();
  }
);
