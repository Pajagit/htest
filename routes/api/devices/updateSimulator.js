const Router = require("express").Router;
const passport = require("passport");
const DeviceController = require("../../../controllers/device");

// @route PUT api/devices/simulator/:id
// @desc Update simulator
// @access Private
module.exports = Router({ mergeParams: true }).put(
  "/devices/simulator/:id",
  passport.authenticate("jwt", { session: false }),
  DeviceController.updateSimulator
);
