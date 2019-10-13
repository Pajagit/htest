const Router = require("express").Router;
const passport = require("passport");
const UserController = require("../../../controllers/user");

// @route POST api/users/user/:id/settings
// @desc Get one user by id
// @access private
module.exports = Router({ mergeParams: true }).post(
  "/users/user/:id/settings",
  passport.authenticate("jwt", { session: false }),
  UserController.updateSettings
);
