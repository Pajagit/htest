const Router = require("express").Router;
const passport = require("passport");
const ReportControler = require("../../../controllers/report");

// @route GET api/reports
// @desc all reports route
// @access public
module.exports = Router({ mergeParams: true }).get(
  "/reports",
  passport.authenticate("jwt", { session: false }),
  ReportControler.getAllReports
);
