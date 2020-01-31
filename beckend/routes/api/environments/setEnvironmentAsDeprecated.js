const Router = require("express").Router;
const passport = require("passport");
const EnvironmentControler = require("../../../controllers/environment");

// @route PUT api/environments/environment/:id/deprecated
// @desc Set environment as deprecated route
// @access public
module.exports = Router({ mergeParams: true }).put(
  "/environments/environment/:id/deprecated",
  passport.authenticate("jwt", { session: false }),
  EnvironmentControler.setEnvironmentAsDeprecated
);
