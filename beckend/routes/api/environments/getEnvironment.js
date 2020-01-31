const Router = require("express").Router;
const passport = require("passport");
const EnvironmentControler = require("../../../controllers/environment");

// @route GET api/environments/environment/:id
// @desc get environment by id route
// @access public
module.exports = Router({ mergeParams: true }).get(
  "/environments/environment/:id",
  passport.authenticate("jwt", { session: false }),
  EnvironmentControler.getEnvironment
);
