const Router = require("express").Router;
const passport = require("passport");
const Role = require("../../../models/role");

// @route GET api/roles
// @desc Get all roles
// @access Private
module.exports = Router({ mergeParams: true }).get(
  "/roles",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Role.findAll({
      attributes: ["id", "title"],
      order: [["id", "ASC"]]
    }).then(roles => {
      if (roles) {
        res.json(roles);
      } else {
        res.status(200);
      }
    });
  }
);
