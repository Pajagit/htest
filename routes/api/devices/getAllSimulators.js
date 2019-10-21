const Router = require("express").Router;
const passport = require("passport");
const DeviceController = require("../../../controllers/device");

// @route POST api/simulators
// @desc all simulators route
// @access public
module.exports = Router({ mergeParams: true }).post(
  "/simulators",
  passport.authenticate("jwt", { session: false }),
  DeviceController.getSimulators
);
