const Router = require("express").Router;
const passport = require("passport");
const OperatingSystemControler = require("../../../controllers/operatingsystem");

// @route GET api/operatingsystems
// @desc all operatingsystems route
// @access public
module.exports = Router({ mergeParams: true }).get(
  "/operatingsystems",
  passport.authenticate("jwt", { session: false }),
  OperatingSystemControler.getOperatingSystems
);
