const Router = require("express").Router;
const passport = require("passport");
const SimulatorControler = require("../../../controllers/simulator");

// @route PUT api/simulators/simulator/:id
// @desc Update simulator
// @access Private
module.exports = Router({ mergeParams: true }).put(
  "/simulators/simulator/:id",
  passport.authenticate("jwt", { session: false }),
  SimulatorControler.updateSimulator
);
