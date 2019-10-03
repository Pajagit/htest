const Router = require("express").Router;
const passport = require("passport");
const Project = require("../../../models/project");
const validateProjectInput = require("../../../validation/project").validateProjectInput;

// @route POST api/projects/project
// @desc Create new project
// @access Private
module.exports = Router({ mergeParams: true }).post(
  "/projects/project",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
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

    async function checkIfProjectWithSameTItleExists() {
      return new Promise((resolve, reject) => {
        Project.findOne({
          where: {
            title: req.body.title
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

    async function createProject() {
      return new Promise((resolve, reject) => {
        Project.create({
          title: projectFields.title,
          description: projectFields.description,
          started_at: projectFields.started_at,
          ended_at: projectFields.ended_at,
          image_url: projectFields.image_url,
          project_manager: projectFields.project_manager,
          jira_url: projectFields.jira_url,
          url: projectFields.url
        }).then(project => {
          if (project) {
            resolve(project);
          } else {
            resolve(false);
          }
        });
      });
    }

    async function returnCreatedProject(addedProject) {
      return new Promise((resolve, reject) => {
        if (addedProject) {
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
              id: addedProject.id
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
      var projectExists = await checkIfProjectWithSameTItleExists();
      if (projectExists) {
        res.status(400).json({ title: "Project already exists" });
      } else {
        var createdProject = await createProject();
        if (createdProject) {
          let createdProjectObj = await returnCreatedProject(createdProject);
          res.json(createdProjectObj);
        } else {
          res.status(500).json({ error: "An error occured while creating project" });
        }
      }
    })();
  }
);
