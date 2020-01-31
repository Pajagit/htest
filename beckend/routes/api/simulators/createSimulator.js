const Router = require("express").Router;
const passport = require("passport");
const SimulatorController = require("../../../controllers/simulator");

// @route POST api/simulators/simulator
// @desc Create new simulator
// @access Private
module.exports = Router({ mergeParams: true }).post(
  "/simulators/simulator",
  passport.authenticate("jwt", { session: false }),
  SimulatorController.createSimulator
);
