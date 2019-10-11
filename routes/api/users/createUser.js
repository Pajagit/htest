const Router = require("express").Router;
const passport = require("passport");
const UserController = require("../../../controllers/user");

// @route POST api/users/user
// @desc Create new user
// @access Private
module.exports = Router({ mergeParams: true }).post(
  "/users/user",
  passport.authenticate("jwt", { session: false }),
  UserController.createUser
);
