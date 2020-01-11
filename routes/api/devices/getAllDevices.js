const Router = require("express").Router;
const passport = require("passport");
const DeviceController = require("../../../controllers/device");

// @route GET api/devices/
// @desc all devices route
// @access public
module.exports = Router({ mergeParams: true }).get(
  "/devices",
  passport.authenticate("jwt", { session: false }),
  DeviceController.getDevices
);
