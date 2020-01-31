const Router = require("express").Router;
const passport = require("passport");
const DeviceController = require("../../../controllers/device");

// @route put api/devices/device/:id/deprecated
// @desc Set device as deprecated
// @access Private
module.exports = Router({ mergeParams: true }).put(
  "/devices/device/:id/deprecated",
  passport.authenticate("jwt", { session: false }),
  DeviceController.setDeviceAsDeprecated
);
