const Router = require("express").Router;
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const passport = require("passport");
const Project = require("../../../models/project");
var UserService = require("../../../services/user");

const validateProjectInput = require("../../../validation/project").validateProjectInput;

// @route PUT api/projects/project/:id
// @desc Update project by id
// @access private
module.exports = Router({ mergeParams: true }).put(
  "/projects/project/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    if (isNaN(req.params.id)) {
      res.status(400).json({ error: "Project id is not valid number" });
    } else {
      const { errors, isValid } = validateProjectInput(req.body);
      // Check Validation
      if (!isValid) {
        return res.status(400).json(errors);
      }

      // Get fields
      const projectFields = {};

      if (req.body.title) projectFields.title = req.body.title;
      projectFields.description = req.body.description ? req.body.description : null;
      projectFields.started_at = req.body.started_at ? req.body.started_at : null;
      projectFields.ended_at = req.body.ended_at ? req.body.ended_at : null;
      projectFields.image_url = req.body.image_url ? req.body.image_url : null;
      projectFields.project_manager = req.body.project_manager ? req.body.project_manager : null;
      projectFields.jira_url = req.body.jira_url ? req.body.jira_url : null;
      projectFields.url = req.body.url ? req.body.url : null;
      projectFields.updated_at = new Date();

      // check if project exists
      async function checkIfProjectExist() {
        return new Promise((resolve, reject) => {
          Project.findOne({
            where: {
              id: req.params.id
            }
          }).then(project => {
            if (project) {
              resolve(true);
            } else {
              resolve(false);
            }
          });
        });
      }

      async function checkIfProjectWithSameTItleExists() {
        return new Promise((resolve, reject) => {
          Project.findOne({
            where: {
              title: req.body.title,
              id: {
                [Op.ne]: req.params.id
              }
            }
          })
            .then(project => {
              if (project) {
                resolve(true);
              } else {
                resolve(false);
              }
            })
            .catch(err => console.log(err));
        });
      }

      async function updateProject() {
        return new Promise((resolve, reject) => {
          Project.update(projectFields, {
            where: { id: req.params.id },
            returning: true,
            plain: true
          }).then(project => {
            if (project) {
              resolve(true);
            } else {
              resolve(false);
            }
          });
        });
      }

      async function returnUpdatedProject(updatedProject) {
        return new Promise((resolve, reject) => {
          if (updatedProject) {
            Project.findOne({
              attributes: [
                "id",
                "title",
                "description",
                "started_at",
                "ended_at",
                "image_url",
                "project_manager",
                "url",
                "jira_url"
              ],
              where: {
                id: req.params.id
              }
            }).then(project => {
              if (project) {
                resolve(project);
              } else {
                resolve(false);
              }
            });
          }
        });
      }

      (async () => {
        let checkEntityExistance = await checkIfProjectExist();
        if (!checkEntityExistance) {
          res.status(404).json({ error: "Project doesn't exist" });
        } else {
          var canUpdateProject = await UserService.canUpdateProject(req.user, req.params.id);
          if (!canUpdateProject) {
            return res.status(403).json({ message: "Forbiden" });
          }
          var projectWithSameTitle = await checkIfProjectWithSameTItleExists();
          if (projectWithSameTitle) {
            res.status(400).json({ title: "Project already exists" });
          } else {
            let updatedProject = await updateProject();
            let project = await returnUpdatedProject(updatedProject);
            res.json(project);
          }
        }
      })();
    }
  }
);
