const Router = require("express").Router;
const passport = require("passport");
const UserController = require("../../../controllers/user");
// @route PUT api/users/user/:id
// @desc Update user by id
// @access private
module.exports = Router({ mergeParams: true }).put(
  "/users/user/:id",
  passport.authenticate("jwt", { session: false }),
  UserController.updateUser
);
