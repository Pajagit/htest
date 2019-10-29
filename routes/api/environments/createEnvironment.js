const Router = require("express").Router;
const passport = require("passport");
const EnvironmentControler = require("../../../controllers/environment");

// @route POST api/environments
// @desc Create environments route
// @access public
module.exports = Router({ mergeParams: true }).post(
  "/environments/environment",
  passport.authenticate("jwt", { session: false }),
  EnvironmentControler.createEnvironment
);
