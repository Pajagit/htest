const Router = require("express").Router;
const passport = require("passport");
const UserController = require("../../../controllers/user");

// @route DELETE api/users/user/:id/project/:project_id
// @desc Update user projects
// @access private
module.exports = Router({ mergeParams: true }).delete(
  "/users/user/:id/project/:project_id",
  passport.authenticate("jwt", { session: false }),
  UserController.removeProject
);
