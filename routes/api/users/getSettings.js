const Router = require("express").Router;
const passport = require("passport");
const UserController = require("../../../controllers/user");

// @route GET api/users/user/:id/settings
// @desc Get user settings by id
// @access private
module.exports = Router({ mergeParams: true }).get(
  "/users/user/:id/settings",
  passport.authenticate("jwt", { session: false }),
  UserController.getSettings
);
