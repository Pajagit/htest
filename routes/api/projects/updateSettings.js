const Router = require("express").Router;
const passport = require("passport");
const ProjectController = require("../../../controllers/project");

// @route Update api/projects/project/:id/settings
// @desc Update project settings by id
// @access Private
module.exports = Router({ mergeParams: true }).put(
  "/projects/project/:id/settings",
  passport.authenticate("jwt", { session: false }),
  ProjectController.updateProjectSettings
);
