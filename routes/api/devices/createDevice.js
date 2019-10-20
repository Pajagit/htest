const Router = require("express").Router;
const passport = require("passport");
const DeviceController = require("../../../controllers/device");

// @route POST api/devices/device
// @desc Create new device
// @access Private
module.exports = Router({ mergeParams: true }).post(
  "/devices/device",
  passport.authenticate("jwt", { session: false }),
  DeviceController.createDevice
);
