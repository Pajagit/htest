const Router = require("express").Router;
const passport = require("passport");
const DeviceController = require("../../../controllers/device");

// @route GET api/devices/simulator/:id
// @desc Get device by id
// @access public
module.exports = Router({ mergeParams: true }).get(
  "/devices/simulator/:id",
  passport.authenticate("jwt", { session: false }),
  DeviceController.getSimulatorById
);
