const Router = require("express").Router;
const passport = require("passport");
const SimulatorService = require("../../../controllers/simulator");

// @route deprecate api/simulators/simulator/:id/deprecated
// @desc Set simulator as deprecated
// @access Private
module.exports = Router({ mergeParams: true }).put(
  "/simulators/simulator/:id/deprecated",
  passport.authenticate("jwt", { session: false }),
  SimulatorService.setSimulatorAsDeprecated
);
