const Router = require("express").Router;
const passport = require("passport");
const ProjectController = require("../../../controllers/project");

// @route GET api/projects/project/:id/testcase-filters"
// @desc Get project by id
// @access Private
module.exports = Router({ mergeParams: true }).get(
  "/projects/project/:id/testcase-filters",
  passport.authenticate("jwt", { session: false }),
  ProjectController.getTestcaseFilterSetup
);
