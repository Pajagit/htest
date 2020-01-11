const Router = require("express").Router;
const passport = require("passport");
const DeviceController = require("../../../controllers/device");

// @route put api/devices/device/:id/isused
// @desc Set device is used
// @access Private
module.exports = Router({ mergeParams: true }).put(
  "/devices/device/:id/isused",
  passport.authenticate("jwt", { session: false }),
  DeviceController.setDeviceIsUsed
);
