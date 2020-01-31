const Router = require("express").Router;
const passport = require("passport");
const ProjectController = require("../../../controllers/project");

// @route DELETE api/projects/project/:id
// @desc GDelete project by id
// @access Private
module.exports = Router({ mergeParams: true }).delete(
  "/projects/project/:id",
  passport.authenticate("jwt", { session: false }),
  ProjectController.deactivateProject
);
