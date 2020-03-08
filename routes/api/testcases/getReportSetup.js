const Router = require("express").Router;
const passport = require("passport");
const ReportController = require("../../../controllers/report");

// @route GET api/testcases/testcase/:id/setup
// @desc Get reports setup
// @access public
module.exports = Router({ mergeParams: true }).get(
  "/testcases/testcase/:id/setup",
  passport.authenticate("jwt", { session: false }),
  ReportController.getReportSetup
);
