const Router = require("express").Router;
const passport = require("passport");
const OperatingSystemController = require("../../../controllers/os");

// @route GET api/operatingsystems
// @desc all operating systems route
// @access public
module.exports = Router({ mergeParams: true }).get(
  "/operatingsystems",
  passport.authenticate("jwt", { session: false }),
  OperatingSystemController.getOperatingSystems
);
