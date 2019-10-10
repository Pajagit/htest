const Router = require("express").Router;
const passport = require("passport");
const ProjectController = require("../../../controllers/project");

// @route POST api/projects/project
// @desc Create new project
// @access Private
module.exports = Router({ mergeParams: true }).post(
  "/projects/project",
  passport.authenticate("jwt", { session: false }),
  ProjectController.createProject
);
