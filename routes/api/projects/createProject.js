const Router = require("express").Router;
const passport = require("passport");
const Project = require("../../../models/project");
const Role = require("../../../models/role");
const User = require("../../../models/user");
const UserRoleProject = require("../../../models/userroleproject");

const validateProjectInput = require("../../../validation/project").validateProjectInput;
var UserService = require("../../../services/user");

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

    async function getSuperadminRoleId() {
      return new Promise((resolve, reject) => {
        Role.findOne({
          where: {
            title: "Superadmin"
          }
        })
          .then(role => {
            if (role) {
              resolve(role.id);
            } else {
              resolve(false);
            }
          })
          .catch(err => console.log(err));
      });
    }

    async function findAllSuperadminUsers(role_id) {
      return new Promise((resolve, reject) => {
        User.findAll({
          include: [
            {
              model: Project,
              attributes: ["title"],
              through: {
                attributes: ["role_id"],
                where: { role_id: role_id }
              },
              as: "projects",
              required: true
            }
          ]
        })
          .then(users => {
            if (users) {
              resolve(users);
            } else {
              resolve(false);
            }
          })
          .catch(err => console.log(err));
      });
    }

    async function addProjectToSuperadminUsers(users, projectId, role_id) {
      return new Promise((resolve, reject) => {
        var userObjects = [];
        users.forEach(user => {
          var user = {
            user_id: user.id,
            role_id: role_id,
            project_id: projectId
          };
          userObjects.push(user);
        });

        UserRoleProject.bulkCreate(userObjects).then(projects => {
          resolve(true);
        });
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
      var canCreateProject = await UserService.canCreateProject(req.user, req.params.id);
      if (!canCreateProject) {
        return res.status(403).json({ message: "Forbiden" });
      }
      var projectExists = await checkIfProjectWithSameTItleExists();
      if (projectExists) {
        res.status(400).json({ title: "Project already exists" });
      } else {
        var createdProject = await createProject();
        if (createdProject) {
          let createdProjectObj = await returnCreatedProject(createdProject);
          console.log();
          if (createdProjectObj) {
            var superadminRoleId = await getSuperadminRoleId();
            var superadminUsers = await findAllSuperadminUsers(superadminRoleId);
            var addedProjectToSuperadmins = await addProjectToSuperadminUsers(
              superadminUsers,
              createdProjectObj.id,
              superadminRoleId
            );
            if (addedProjectToSuperadmins) {
              res.json(createdProjectObj);
            }
          }
        } else {
          res.status(500).json({ error: "An error occured while creating project" });
        }
      }
    })();
  }
);
