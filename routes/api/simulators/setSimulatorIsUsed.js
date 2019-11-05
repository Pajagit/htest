const Router = require("express").Router;
const passport = require("passport");
const SimulatorController = require("../../../controllers/simulator");

// @route put api/simulators/simulator/:id/isused
// @desc Set simulator is used
// @access Private
module.exports = Router({ mergeParams: true }).put(
  "/simulators/simulator/:id/isused",
  passport.authenticate("jwt", { session: false }),
  SimulatorController.setSimulatorIsUsed
);
