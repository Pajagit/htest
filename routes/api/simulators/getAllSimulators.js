const Router = require("express").Router;
const passport = require("passport");
const SimulatorController = require("../../../controllers/simulator");

// @route GET api/simulators
// @desc all devices route
// @access public
module.exports = Router({ mergeParams: true }).post(
  "/simulators",
  passport.authenticate("jwt", { session: false }),
  SimulatorController.getSimulators
);
