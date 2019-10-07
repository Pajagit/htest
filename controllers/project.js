var ProjectService = require("../services/project");

const validateRouteProjectId = require("../validation/project").validateRouteProjectId;

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
      var deleteProject = await ProjectService.deactivateProject(req.params.id);
      if (deleteProject) {
        return res.status(200).json({ success: "Project deactivated successfully" });
      } else {
        return res.status(500).json({ message: "Something went wrong" });
      }
    }
  },
  getProjects: async function(req, res) {
    var projects = await ProjectService.getProjects(req.query.searchTerm);
    if (projects) {
      return res.status(200).json(projects);
    } else {
      return res.status(500).json({ message: "Something went wrong" });
    }
  }
};
