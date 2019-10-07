const Router = require("express").Router;
const passport = require("passport");
const ProjectController = require("../../../controllers/project");

// @route GET api/projects
// @desc GET all projects
// @access Private
module.exports = Router({ mergeParams: true }).get(
  "/projects",
  passport.authenticate("jwt", { session: false }),
  ProjectController.getProjects
);
