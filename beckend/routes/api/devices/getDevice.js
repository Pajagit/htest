const Router = require("express").Router;
const passport = require("passport");
const DeviceController = require("../../../controllers/device");

// @route GET api/devices/device/:id
// @desc Get device by id
// @access public
module.exports = Router({ mergeParams: true }).get(
  "/devices/device/:id",
  passport.authenticate("jwt", { session: false }),
  DeviceController.getDeviceById
);
