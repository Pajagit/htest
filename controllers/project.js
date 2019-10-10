var ProjectService = require("../services/project");
var UserService = require("../services/user");
var RoleService = require("../services/role");

const validateRouteProjectId = require("../validation/project").validateRouteProjectId;
const validateProjectInput = require("../validation/project").validateProjectInput;

module.exports = {
  deactivateProject: async function(req, res) {
    const { errors, isValid } = validateRouteProjectId(req.params);

    // Check Validation
    if (!isValid) {
      return res.status(400).json(errors);
    }

    var projectExists = await ProjectService.checkIfProjectExist(req.params.id);
    if (!projectExists) {
      return res.status(404).json({ error: "Project doesn't exist" });
    } else {
      var canDeleteProject = await UserService.canDeleteProject(req.user, req.params.id);
      if (!canDeleteProject) {
        return res.status(403).json({ message: "Forbiden" });
      }
      var deleteProject = await ProjectService.deactivateProject(req.params.id);
      if (deleteProject) {
        return res.status(200).json({ success: "Project deactivated successfully" });
      } else {
        return res.status(500).json({ message: "Something went wrong" });
      }
    }
  },
  getProjects: async function(req, res) {
    var projects = await ProjectService.getProjects(req.query.searchTerm, req.user);

    if (projects) {
      return res.status(200).json(projects);
    } else {
      return res.status(500).json({ message: "Something went wrong" });
    }
  },
  getProjectById: async function(req, res) {
    var canGetProject = await UserService.canGetProject(req.user, req.params.id);
    if (!canGetProject) {
      return res.status(403).json({ message: "Forbiden" });
    }
    var project = await ProjectService.getProjectById(req.params.id);

    var projectWithRole = {};
    projectWithRole.id = project.id;
    projectWithRole.title = project.title;
    projectWithRole.image_url = project.image_url;
    projectWithRole.description = project.description;
    projectWithRole.deleted = project.deleted;
    projectWithRole.project_manager = project.project_manager;
    projectWithRole.url = project.url;
    projectWithRole.jira_url = project.jira_url;

    var projectRole = await ProjectService.findUserRole(project.users);
    projectWithRole.users = projectRole.sort((a, b) => b.id - a.id);

    if (projectWithRole) {
      return res.status(200).json(projectWithRole);
    }
  },
  updateProject: async function(req, res) {
    if (isNaN(req.params.id)) {
      return res.status(400).json({ error: "Project id is not valid number" });
    }
    var canUpdateProject = await UserService.canUpdateProject(req.user, req.params.id);
    if (!canUpdateProject) {
      return res.status(403).json({ message: "Forbiden" });
    }
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

    let checkEntityExistance = await ProjectService.checkIfProjectExist(req.params.id);
    if (!checkEntityExistance) {
      return res.status(404).json({ error: "Project doesn't exist" });
    } else {
      var projectWithSameTitle = await ProjectService.checkIfProjectWithSameTitleExists(req.body.title, req.params.id);
      if (projectWithSameTitle) {
        return res.status(400).json({ title: "Project already exists" });
      } else {
        var updatedProject = await ProjectService.updateProject(projectFields, req.params.id);
        var project = await ProjectService.returnUpdatedProject(updatedProject[1].id);
        return res.json(project);
      }
    }
  },
  createProject: async function(req, res) {
    var canCreateProject = await UserService.canCreateProject(req.user);
    if (!canCreateProject) {
      return res.status(403).json({ message: "Forbiden" });
    }
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

    var projectExists = await ProjectService.checkIfProjectWithSameTitleExists(req.body.title);
    if (projectExists) {
      return res.status(400).json({ title: "Project already exists" });
    } else {
      var createdProject = await ProjectService.createProject(projectFields);
      if (createdProject) {
        let createdProjectObj = await ProjectService.returnUpdatedProject(createdProject.id);
        if (createdProjectObj) {
          var superadminRoleId = await RoleService.getSuperadminRoleId();
          var superadminUsers = await UserService.findAllSuperadminUsers(superadminRoleId);
          var addedProjectToSuperadmins = await ProjectService.addProjectToSuperadminUsers(
            superadminUsers,
            createdProjectObj.id,
            superadminRoleId
          );
          if (addedProjectToSuperadmins) {
            return res.json(createdProjectObj);
          }
        }
      } else {
        return res.status(500).json({ error: "An error occured while creating project" });
      }
    }
  }
};
