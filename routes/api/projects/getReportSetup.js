const Router = require("express").Router;
const passport = require("passport");
const ReportController = require("../../../controllers/report");

// @route GET api/projects/project/:id/setup
// @desc Get reports setup
// @access public
module.exports = Router({ mergeParams: true }).get(
  "/projects/project/:id/report-setup",
  passport.authenticate("jwt", { session: false }),
  ReportController.getReportSetup
);
