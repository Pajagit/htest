const Router = require("express").Router;
const passport = require("passport");
const DeviceController = require("../../../controllers/device");

// @route delete api/devices/device/:id
// @desc Delete device
// @access Private
module.exports = Router({ mergeParams: true }).delete(
  "/devices/device/:id",
  passport.authenticate("jwt", { session: false }),
  DeviceController.deleteDevice
);
