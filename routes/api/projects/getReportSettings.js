const Router = require("express").Router;
const passport = require("passport");
const ProjectController = require("../../../controllers/project");

// @route GET api/projects/project/:id/report-settings"
// @desc Get project by id
// @access Private
module.exports = Router({ mergeParams: true }).get(
  "/projects/project/:id/report-settings",
  passport.authenticate("jwt", { session: false }),
  ProjectController.getReportSettings
);
