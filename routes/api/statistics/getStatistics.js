const Router = require("express").Router;
const passport = require("passport");
const StatisticsController = require("../../../controllers/statistics");

// @route get api/projects/project/:id/statistics
// @desc GET statistics
// @access Private
module.exports = Router({ mergeParams: true }).get(
  "/projects/project/:id/statistics",
  passport.authenticate("jwt", { session: false }),
  StatisticsController.getStatistics
);
