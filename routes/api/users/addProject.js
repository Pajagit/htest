const Router = require("express").Router;
const passport = require("passport");
const UserController = require("../../../controllers/user");

// @route POST api/users/user/:id/project
// @desc Update user projects
// @access private
module.exports = Router({ mergeParams: true }).post(
  "/users/user/:id/project",
  passport.authenticate("jwt", { session: false }),
  UserController.addProject
);
