const Router = require("express").Router;
const passport = require("passport");
const ReportController = require("../../../controllers/report");

// @route GET api/projects/project/:id/report-filters"
// @desc Get project by id
// @access Private
module.exports = Router({ mergeParams: true }).get(
  "/projects/project/:id/report-filters",
  passport.authenticate("jwt", { session: false }),
  ReportController.getReportFilterSetup
);
