const Router = require("express").Router;
const passport = require("passport");
const UserController = require("../../../controllers/user");

// @route GET api/users/user/:id
// @desc Get one user by id
// @access private
module.exports = Router({ mergeParams: true }).get(
  "/users/user/:id",
  passport.authenticate("jwt", { session: false }),
  UserController.getUser
);
