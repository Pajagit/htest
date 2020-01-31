const Router = require("express").Router;
const passport = require("passport");
const ReportControler = require("../../../controllers/report");

// @route POST api/reports/report
// @desc create report route
// @access public
module.exports = Router({ mergeParams: true }).post(
  "/reports/report",
  passport.authenticate("jwt", { session: false }),
  ReportControler.createReport
);
