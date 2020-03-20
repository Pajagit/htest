const Router = require("express").Router;
const passport = require("passport");
const StatisticsController = require("../../../controllers/statistics");

// @route get api/statistics
// @desc GET statistics
// @access Private
module.exports = Router({ mergeParams: true }).get(
  "/statistics",
  passport.authenticate("jwt", { session: false }),
  StatisticsController.getGlobalStatistics
);
