const Router = require("express").Router;
const passport = require("passport");
const ReportController = require("../../../controllers/report");

// @route GET api/repots/statuses
// @desc Get reports statuses
// @access public
module.exports = Router({ mergeParams: true }).get(
  "/reports/statuses",
  passport.authenticate("jwt", { session: false }),
  ReportController.getReportStatuses
);
