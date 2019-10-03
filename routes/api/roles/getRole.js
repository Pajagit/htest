const Router = require("express").Router;
const passport = require("passport");
const RoleController = require("../../../controllers/role");

// @route GET api/roles/role/:id
// @desc Get role by id
// @access Private
module.exports = Router({ mergeParams: true }).get(
  "/roles/role/:id",
  passport.authenticate("jwt", { session: false }),
  RoleController.getRoles
);
