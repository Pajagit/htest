const Router = require("express").Router;
const passport = require("passport");
const EnvironmentControler = require("../../../controllers/environment");

// @route GET api/environments
// @desc all environments route
// @access public
module.exports = Router({ mergeParams: true }).get(
  "/environments",
  passport.authenticate("jwt", { session: false }),
  EnvironmentControler.getAllEnvironments
);
