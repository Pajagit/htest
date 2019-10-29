const Router = require("express").Router;
const passport = require("passport");
const VersionControler = require("../../../controllers/version");

// @route PUT api/versions/version/:id
// @desc create version route
// @access public
module.exports = Router({ mergeParams: true }).put(
  "/versions/version/:id",
  passport.authenticate("jwt", { session: false }),
  VersionControler.updateVersion
);
