const Router = require("express").Router;
const passport = require("passport");
const TestcaseController = require("../../../controllers/testcase");

// @route POST api/testcases
// @desc POST all testcases
// @access Private
module.exports = Router({ mergeParams: true }).post(
  "/testcases",
  passport.authenticate("jwt", { session: false }),
  TestcaseController.getAllTestcases
);
