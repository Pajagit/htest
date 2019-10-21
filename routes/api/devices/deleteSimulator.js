const Router = require("express").Router;
const passport = require("passport");
const DeviceController = require("../../../controllers/device");

// @route delete api/devices/simulator/:id
// @desc Delete simulator
// @access Private
module.exports = Router({ mergeParams: true }).delete(
  "/devices/simulator/:id",
  passport.authenticate("jwt", { session: false }),
  DeviceController.deleteSimulator
);
