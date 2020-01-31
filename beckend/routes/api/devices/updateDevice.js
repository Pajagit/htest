const Router = require("express").Router;
const passport = require("passport");
const DeviceController = require("../../../controllers/device");

// @route PUT api/devices/device/:id
// @desc Update device
// @access Private
module.exports = Router({ mergeParams: true }).put(
  "/devices/device/:id",
  passport.authenticate("jwt", { session: false }),
  DeviceController.updateDevice
);
