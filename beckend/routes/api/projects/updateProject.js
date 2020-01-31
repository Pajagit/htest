const Router = require("express").Router;
const passport = require("passport");
const ProjectController = require("../../../controllers/project");

// @route PUT api/projects/project/:id
// @desc Update project by id
// @access private
module.exports = Router({ mergeParams: true }).put(
  "/projects/project/:id",
  passport.authenticate("jwt", { session: false }),
  ProjectController.updateProject
);
