const Router = require("express").Router;
const passport = require("passport");
const VersionControler = require("../../../controllers/version");

// @route PUT api/versions/version/:id/isused
// @desc set is used for version version route
// @access public
module.exports = Router({ mergeParams: true }).put(
  "/versions/version/:id/isused",
  passport.authenticate("jwt", { session: false }),
  VersionControler.seVersionIsUsed
);
