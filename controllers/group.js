var GroupService = require("../services/group");
var ColorService = require("../services/color");
var ProjectService = require("../services/project");

const validateRouteGroupId = require("../validation/group").validateRouteGroupId;
const validateGroupInput = require("../validation/group").validateGroupInput;

module.exports = {
  getGroupById: async function(req, res) {
    const { errors, isValid } = validateRouteGroupId(req.params);

    // Check Validation
    if (!isValid) {
      return res.status(400).json(errors);
    }

    var group = await GroupService.getGroupById(req.params.id);
    if (group) {
      return res.status(200).json(group);
    } else {
      return res.status(404).json({ message: "Group doesn't exist" });
    }
  },
  createGroup: async function(req, res) {
    (async () => {
      const { errors, isValid } = validateGroupInput(req.body, true);

      // Check Validation
      if (!isValid) {
        return res.status(400).json(errors);
      }
      if (req.body.project_id && !isNaN(req.body.project_id)) {
        var project_exists = await ProjectService.checkIfProjectExist(req.body.project_id);
      }
      if (!project_exists) {
        return res.status(400).json({ project_id: "Project doesn't exist" });
      }

      var all_colors = await GroupService.getAllColorsFromGroups();
      var unused_color = await ColorService.getUnusedColorFromColors(all_colors);
      if (!unused_color) {
        unused_color = await GroupService.getLeastUsedColorFromGroups();
      }
      var group_exists = await GroupService.checkIfGroupWithSameTitleExists(req.body.title);
      if (group_exists) {
        res.status(400).json({ error: "Group already exists" });
      } else {
        var group_fields = await GroupService.getFields(req.body, req.user, unused_color);
        var created_group = await GroupService.createGroup(group_fields);
        if (created_group) {
          let created_group_obj = await GroupService.returnCreatedOrUpdatedGroup(created_group);
          res.json(created_group_obj);
        } else {
          res.status(500).json({ error: "An error occured while creating group" });
        }
      }
    })();
  },
  updateGroup: async function(req, res) {
    if (isNaN(req.params.id)) {
      res.status(400).json({ error: "Group id is not valid number" });
    } else {
      const { errors, isValid } = validateGroupInput(req.body, false);
      // Check Validation
      if (!isValid) {
        return res.status(400).json(errors);
      }
      if (req.params.id) {
        let checkEntityExistance = await GroupService.checkIfGroupExistById(req.params.id);
        if (!checkEntityExistance) {
          return res.status(404).json({ error: "Group doesn't exist" });
        }
      }
      if (req.body.project_id && !isNaN(req.body.project_id)) {
        var project_exists = await ProjectService.checkIfProjectExist(req.body.project_id);
        if (!project_exists) {
          return res.status(400).json({ project_id: "Project doesn't exist" });
        }
      }

      var data = {};
      if (req.body.title) {
        data.title = req.body.title;
      }
      if (typeof req.body.isPinned === "boolean") {
        data.pinned = req.body.isPinned;
      }

      (async () => {
        var groupWithSameTitle = await GroupService.checkIfAnotherGroupWithSameTitleExists(
          req.body.title,
          req.params.id
        );
        if (groupWithSameTitle) {
          return res.status(400).json({ error: "Group already exists" });
        }
        var updatedGroup = await GroupService.updateGroup(req.params.id, data);
        var group = await GroupService.returnCreatedOrUpdatedGroup(updatedGroup);
        res.status(200).json(group);
      })();
    }
  }
};
