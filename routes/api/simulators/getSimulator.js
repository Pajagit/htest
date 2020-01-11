const Router = require("express").Router;
const passport = require("passport");
const SimulatorController = require("../../../controllers/simulator");

// @route GET api/simulators/simulator/:id
// @desc Get simulator by id
// @access public
module.exports = Router({ mergeParams: true }).get(
  "/simulators/simulator/:id",
  passport.authenticate("jwt", { session: false }),
  SimulatorController.getSimulatorById
);
