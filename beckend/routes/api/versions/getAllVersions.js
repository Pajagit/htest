const Router = require("express").Router;
const passport = require("passport");
const VersionControler = require("../../../controllers/version");

// @route GET api/versions
// @desc all versions route
// @access public
module.exports = Router({ mergeParams: true }).get(
  "/versions",
  passport.authenticate("jwt", { session: false }),
  VersionControler.getAllVersions
);
