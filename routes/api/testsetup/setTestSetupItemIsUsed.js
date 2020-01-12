const Router = require("express").Router;
const passport = require("passport");
const TestSetupController = require("../../../controllers/testsetup");

// @route put api/testsetup
// @desc Set test setup item is used
// @access Private
module.exports = Router({ mergeParams: true }).put(
  "/testsetup",
  passport.authenticate("jwt", { session: false }),
  TestSetupController.seTestSetupItemIsUsed
);
