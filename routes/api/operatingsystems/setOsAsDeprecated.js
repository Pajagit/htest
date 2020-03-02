const Router = require("express").Router;
const passport = require("passport");
const OsControler = require("../../../controllers/operatingsystem");

// @route PUT api/operatingsystems/operatingsystem/:id/deprecated
// @desc set os as deprecated route
// @access public
module.exports = Router({ mergeParams: true }).put(
  "/operatingsystems/operatingsystem/:id/deprecated",
  passport.authenticate("jwt", { session: false }),
  OsControler.setOSAsDeprecated
);
