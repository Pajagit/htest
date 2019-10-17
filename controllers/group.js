const GroupService = require("../services/group");
const ColorService = require("../services/color");
const ProjectService = require("../services/project");
const UserService = require("../services/user");

const validateRouteGroupId = require("../validation/group").validateRouteGroupId;
const validateGroupInput = require("../validation/group").validateGroupInput;
const validateRouteProjectId = require("../validation/group").validateRouteProjectId;

module.exports = {
  getGroupById: async function(req, res) {
    const { errors, isValid } = validateRouteGroupId(req.params);

    // Check Validation
    if (!isValid) {
      return res.status(400).json(errors);
    }

    var group = await GroupService.getGroupById(req.params.id);
    if (group) {
      var canGetGroup = await UserService.canGetProject(req.user, group.project_id);
      if (!canGetGroup) {
        return res.status(403).json({ message: "Forbidden" });
      }
      return res.status(200).json(group);
    } else {
      return res.status(404).json({ error: "Group doesn't exist" });
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
        return res.status(400).json({ error: "Project doesn't exist" });
      }
      var canCreateGroup = await UserService.canCreateEditDeleteGroup(req.user, req.body.project_id);
      if (!canCreateGroup) {
        return res.status(403).json({ message: "Forbidden" });
      }
      var all_colors = await GroupService.getAllColorsFromGroups();
      var unused_color = await ColorService.getUnusedColorFromColors(all_colors);
      if (!unused_color) {
        unused_color = await GroupService.getLeastUsedColorFromGroups();
      }
      var group_exists = await GroupService.checkIfGroupWithSameTitleExists(req.body.title, req.body.project_id);
      if (group_exists) {
        res.status(400).json({ title: "Group already exists" });
      } else {
        var group_fields = await GroupService.getFields(req.body, req.user, unused_color);
        var created_group = await GroupService.createGroup(group_fields);
        if (created_group) {
          var created_group_obj = await GroupService.returnCreatedOrUpdatedGroup(created_group);
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
        var groupExists = await GroupService.checkIfGroupExistById(req.params.id);
        if (!groupExists) {
          return res.status(404).json({ error: "Group doesn't exist" });
        }
      }

      var data = {};
      if (req.body.title) {
        data.title = req.body.title;
      }
      if (typeof req.body.pinned === "boolean") {
        data.pinned = req.body.pinned;
      }

      (async () => {
        var group = await GroupService.checkIfGroupExistById(req.params.id);
        var canCreateGroup = await UserService.canCreateEditDeleteGroup(req.user, group.project_id);
        if (!canCreateGroup) {
          return res.status(403).json({ message: "Forbidden" });
        }
        var groupWithSameTitle = await GroupService.checkIfAnotherGroupWithSameTitleExists(
          req.body.title,
          req.params.id,
          group.project_id
        );
        if (groupWithSameTitle) {
          return res.status(400).json({ title: "Group already exists" });
        }
        var updatedGroup = await GroupService.updateGroup(req.params.id, data);
        var group = await GroupService.returnCreatedOrUpdatedGroup(updatedGroup);
        res.status(200).json(group);
      })();
    }
  },
  deleteGroup: async function(req, res) {
    const { errors, isValid } = validateRouteGroupId(req.params);

    // Check Validation
    if (!isValid) {
      return res.status(400).json(errors);
    }
    var group = await GroupService.checkIfGroupExistById(req.params.id);
    if (!group) {
      return res.status(404).json({ error: "Group doesn't exist" });
    } else {
      var canCreateGroup = await UserService.canCreateEditDeleteGroup(req.user, group.project_id);
      if (!canCreateGroup) {
        return res.status(403).json({ message: "Forbidden" });
      }
      var groupHasTestCases = await GroupService.groupHasTestcases(req.params.id);

      if (groupHasTestCases) {
        return res.status(400).json({ error: "There are test cases related to this group" });
      } else {
        var removeGroup = await GroupService.removeGroup(req.params.id);
        if (removeGroup) {
          return res.status(200).json({ success: "Group successfully deleted" });
        } else {
          return res.status(500).json({ error: "Something went wrong" });
        }
      }
    }
  },
  getAllGroups: async function(req, res) {
    const { errors, isValid } = validateRouteProjectId(req.query);

    // Check Validation
    if (!isValid) {
      return res.status(400).json(errors);
    } else {
      var projectExists = await ProjectService.checkIfProjectExist(req.query.project_id);
      if (!projectExists) {
        return res.status(404).json({ error: "Project doesn't exist" });
      }
      var canGetProject = await UserService.canGetProject(req.user, req.query.project_id);
      if (!canGetProject) {
        return res.status(403).json({ message: "Forbidden" });
      }
      var getAllProjectGroups = await GroupService.getAllProjectGroups(req.query.project_id);
      if (getAllProjectGroups) {
        res.status(200).json(getAllProjectGroups);
      } else {
        res.status(500).json({ error: "Something went wrong" });
      }
    }
  }
};
