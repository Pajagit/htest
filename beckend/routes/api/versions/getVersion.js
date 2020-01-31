const Router = require("express").Router;
const passport = require("passport");
const VersionControler = require("../../../controllers/version");

// @route GET api/versions/version/:id
// @desc all versions route
// @access public
module.exports = Router({ mergeParams: true }).get(
  "/versions/version/:id",
  passport.authenticate("jwt", { session: false }),
  VersionControler.getVersion
);
