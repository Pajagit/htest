const Router = require("express").Router;
const passport = require("passport");
const DeviceController = require("../../../controllers/device");

// @route POST api/devices/
// @desc all devices route
// @access public
module.exports = Router({ mergeParams: true }).post(
  "/devices",
  passport.authenticate("jwt", { session: false }),
  DeviceController.getDevices
);
