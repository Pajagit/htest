const Router = require("express").Router;
const passport = require("passport");
const TestSetupController = require("../../../controllers/testsetup");

// @route GET api/testsetup
// @desc all test setup items route
// @access public
module.exports = Router({ mergeParams: true }).get(
  "/testsetup",
  passport.authenticate("jwt", { session: false }),
  TestSetupController.getAllTestSetupItems
);
