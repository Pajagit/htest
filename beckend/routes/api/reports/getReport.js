const Router = require("express").Router;
const passport = require("passport");
const ReportControllet = require("../../../controllers/report");

// @route GET api/repots/report/:id
// @desc Get report by id route
// @access public
module.exports = Router({ mergeParams: true }).get(
  "/reports/report/:id",
  passport.authenticate("jwt", { session: false }),
  ReportControllet.getReport
);
