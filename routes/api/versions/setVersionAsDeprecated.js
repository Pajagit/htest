const Router = require("express").Router;
const passport = require("passport");
const VersionControler = require("../../../controllers/version");

// @route PUT api/versions/version/:id/deprecated
// @desc set version as deprecated route
// @access public
module.exports = Router({ mergeParams: true }).put(
  "/versions/version/:id/deprecated",
  passport.authenticate("jwt", { session: false }),
  VersionControler.setVersionAsDeprecated
);
