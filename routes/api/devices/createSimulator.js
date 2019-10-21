const Router = require("express").Router;
const passport = require("passport");
const DeviceController = require("../../../controllers/device");

// @route POST api/devices/simulator
// @desc Create new simulator
// @access Private
module.exports = Router({ mergeParams: true }).post(
  "/devices/simulator",
  passport.authenticate("jwt", { session: false }),
  DeviceController.createSimulator
);
