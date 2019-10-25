const Router = require("express").Router;
const passport = require("passport");
const OperatingSystemController = require("../../../controllers/os");

// @route GET api/mobileoperatingsystems
// @desc all mobile operating systems route
// @access public
module.exports = Router({ mergeParams: true }).get(
  "/mobileoperatingsystems",
  passport.authenticate("jwt", { session: false }),
  OperatingSystemController.getMobileOperatingSystems
);
