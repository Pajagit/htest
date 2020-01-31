const Router = require("express").Router;
const passport = require("passport");
const EnvironmentControler = require("../../../controllers/environment");

// @route PUT api/environments/environment/:id
// @desc update environment by id route
// @access public
module.exports = Router({ mergeParams: true }).put(
  "/environments/environment/:id",
  passport.authenticate("jwt", { session: false }),
  EnvironmentControler.updateEnvironment
);
