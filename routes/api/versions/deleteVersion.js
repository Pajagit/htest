const Router = require("express").Router;
const passport = require("passport");
const VersionControler = require("../../../controllers/version");

// @route DELETE api/versions/version/:id
// @desc delete version route
// @access public
module.exports = Router({ mergeParams: true }).delete(
  "/versions/version/:id",
  passport.authenticate("jwt", { session: false }),
  VersionControler.deleteVersion
);
