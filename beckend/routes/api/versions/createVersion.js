const Router = require("express").Router;
const passport = require("passport");
const VersionControler = require("../../../controllers/version");

// @route POST api/versions/browser
// @desc create version route
// @access public
module.exports = Router({ mergeParams: true }).post(
  "/versions/version",
  passport.authenticate("jwt", { session: false }),
  VersionControler.createVersion
);
