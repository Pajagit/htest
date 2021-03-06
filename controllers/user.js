const ProjectService = require("../services/project");
const UserService = require("../services/user");
const RoleService = require("../services/role");

const validateUserInput = require("../validation/user").validateUserInput;
const validateUserProjectInput = require("../validation/user").validateUserProjectInput;
const validateSettingsInput = require("../validation/user").validateSettingsInput;

module.exports = {
  createUser: async function(req, res) {
    // Get fields
    const user_fields = {};

    user_fields.email = req.body.email;
    user_fields.first_name = req.body.first_name ? req.body.first_name : null;
    user_fields.last_name = req.body.last_name ? req.body.last_name : null;
    user_fields.position = req.body.position ? req.body.position : null;
    user_fields.image_url = req.body.image_url ? req.body.image_url : null;
    user_fields.superadmin = req.body.superadmin ? req.body.superadmin : null;

    const { errors, isValid } = validateUserInput(req.body, null, false);
    // Check Validation
    if (!isValid) {
      return res.status(400).json(errors);
    }
    var can_update_user = await UserService.getCreateUpdateUser(req.user);
    if (!can_update_user) {
      return res.status(403).json({ message: "Forbidden" });
    }
    var user_exists = await UserService.checkIfUserWithSameMailExist(req.body.email);
    if (user_exists) {
      return res.status(400).json({ error: "User already exist" });
    } else {
      var createdUser = await UserService.createUser(user_fields);
      if (createdUser) {
        var setAsSuperadmin = await UserService.setAsSuperadmin(
          user_fields.superadmin,
          createdUser,
          await RoleService.getSuperadminRoleId()
        );
        var settingsObj = {};

        settingsObj.testcase_project_id = null;

        var createSettings = await UserService.updateSettings(createdUser.id, settingsObj);
        if (setAsSuperadmin && createSettings) {
          var createdUserObj = await UserService.returnCreatedUser(createdUser);
          var roleId = await RoleService.getSuperadminRoleId();
          createdUserObj.superadmin = await UserService.userIsSuperadmin(createdUserObj, roleId);

          return res.json(createdUserObj);
        }
      } else {
        return res.status(500).json({ error: "An error occured while creating user" });
      }
    }
  },
  updateUser: async function(req, res) {
    if (isNaN(req.params.id)) {
      res.status(400).json({ error: "User id is not valid number" });
    }
    var user = await UserService.checkIfUserExistById(req.params.id);
    var last_login = user.last_login;
    if (!user) {
      return res.status(404).json({ error: "User doesn't exist" });
    } else {
      let InputUserData = await UserService.createInputDateFromPayload(req.body, user);
      const { errors, isValid } = validateUserInput(InputUserData, last_login, true);

      // Check Validation
      if (!isValid) {
        return res.status(400).json(errors);
      } else {
        var can_update_user = await UserService.getCreateUpdateUser(req.user);
        if (!can_update_user) {
          return res.status(403).json({ message: "Forbidden" });
        }
        if (req.body.email && !last_login) {
          let anotherUserSameMail = await UserService.checkIfUserWithSameMailExist(req.body.email, req.params.id);
          if (anotherUserSameMail) {
            return res.status(400).json({ email: "User alredy exists" });
          }
        }
        let updatedUser = await UserService.updateUser(InputUserData, req.params.id);
        if (updatedUser) {
          var setAsSuperadmin = await UserService.setAsSuperadmin(
            InputUserData.superadmin,
            updatedUser[1],
            await RoleService.getSuperadminRoleId(),
            true
          );
          if (setAsSuperadmin) {
            let user = await UserService.returnUpdatedUser(updatedUser[1]);
            var roleId = await RoleService.getSuperadminRoleId();
            var superadmin = await UserService.userIsSuperadmin(user, roleId);

            var userWithRole = {};
            userWithRole.id = user.id;
            userWithRole.email = user.email;
            userWithRole.first_name = user.first_name;
            userWithRole.last_name = user.last_name;
            userWithRole.position = user.position;
            userWithRole.image_url = user.image_url;
            userWithRole.active = user.active;
            userWithRole.last_login = user.last_login;
            userWithRole.projects = await UserService.findUserRole(user.projects);
            userWithRole.superadmin = superadmin;

            if (userWithRole) {
              return res.status(200).json(userWithRole);
            }
          }
        }
      }
    }
  },
  getUser: async function(req, res) {
    if (isNaN(req.params.id)) {
      return res.status(400).json({ error: "User id is not valid number" });
    }
    var user = await UserService.checkIfUserExistById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: "User doesn't exist" });
    }

    var can_update_user = await UserService.getCreateUpdateUser(req.user);
    if (!can_update_user) {
      return res.status(403).json({ message: "Forbidden" });
    }
    var user = await UserService.getUserById(req.params.id);
    var roleId = await RoleService.getSuperadminRoleId();
    var superadmin = await UserService.userIsSuperadmin(user, roleId);

    var userWithRole = {};
    userWithRole.id = user.id;
    userWithRole.email = user.email;
    userWithRole.first_name = user.first_name;
    userWithRole.last_name = user.last_name;
    userWithRole.position = user.position;
    userWithRole.image_url = user.image_url;
    userWithRole.active = user.active;
    userWithRole.last_login = user.last_login;
    userWithRole.superadmin = superadmin;

    var projectsRoles = await UserService.findUserRole(user.projects);
    userWithRole.projects = projectsRoles.sort((a, b) => b.id - a.id);

    if (userWithRole) {
      return res.status(200).json(userWithRole);
    }
  },
  addProject: async function(req, res) {
    if (isNaN(req.params.id)) {
      return res.status(400).json({ error: "User id is not valid number" });
    }
    const { errors, isValid } = validateUserProjectInput(req.body);

    // Check Validation
    if (!isValid) {
      return res.status(400).json(errors);
    }

    var user = await UserService.checkIfUserExistById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: "User doesn't exist" });
    } else {
      var project = await ProjectService.checkIfProjectExist(req.body.project_id);
      var role = await RoleService.checkIfRoleExists(req.body.role_id);
      if (!project) {
        return res.status(404).json({ error: "Project doesn't exist" });
      }
      if (!role) {
        return res.status(404).json({ error: "Role doesn't exist" });
      }
      var canAddProjectToUser = await UserService.addRemoveProjectFromUser(req.user, req.body.project_id);
      if (!canAddProjectToUser) {
        return res.status(403).json({ message: "Forbidden" });
      }

      if (project && role) {
        var hasProject = await UserService.checkIfProjectExistsForUser(req.params.id, req.body.project_id);
        if (hasProject) {
          var projectUpdated = await UserService.updateProject(req.params.id, req.body.role_id, req.body.project_id);
        } else {
          var projectAdded = await UserService.addProject(req.params.id, req.body.role_id, req.body.project_id);
        }

        if (projectUpdated || projectAdded) {
          var user = await UserService.getUserById(req.params.id);
          var roleId = await RoleService.getSuperadminRoleId();
          var superadmin = await UserService.userIsSuperadmin(user, roleId);

          var userWithRole = {};
          userWithRole.id = user.id;
          userWithRole.email = user.email;
          userWithRole.first_name = user.first_name;
          userWithRole.last_name = user.last_name;
          userWithRole.position = user.position;
          userWithRole.image_url = user.image_url;
          userWithRole.active = user.active;
          userWithRole.last_login = user.last_login;
          userWithRole.superadmin = superadmin;

          var projectsRoles = await UserService.findUserRole(user.projects);
          userWithRole.projects = projectsRoles.sort((a, b) => b.id - a.id);

          if (userWithRole) {
            return res.status(200).json(userWithRole);
          }
        }
      }
    }
  },
  removeProject: async function(req, res) {
    if (isNaN(req.params.id)) {
      return res.status(400).json({ error: "User id is not valid number" });
    }
    if (isNaN(req.params.project_id)) {
      return res.status(400).json({ error: "Project id is not valid number" });
    }
    var user = await UserService.checkIfUserExistById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: "User doesn't exist" });
    } else {
      var canRemoveProjectToUser = await UserService.addRemoveProjectFromUser(req.user, req.params.project_id);
      if (!canRemoveProjectToUser) {
        return res.status(403).json({ message: "Forbidden" });
      }
      var hasProject = await UserService.checkIfProjectExistsForUser(req.params.id, req.params.project_id);
      if (hasProject) {
        var projectDeleted = await UserService.removeProject(req.params.id, req.params.project_id);
        if (projectDeleted) {
          var user = await UserService.getUserById(req.params.id);
          var roleId = await RoleService.getSuperadminRoleId();
          var superadmin = await UserService.userIsSuperadmin(user, roleId);

          var userWithRole = {};
          userWithRole.id = user.id;
          userWithRole.email = user.email;
          userWithRole.first_name = user.first_name;
          userWithRole.last_name = user.last_name;
          userWithRole.position = user.position;
          userWithRole.image_url = user.image_url;
          userWithRole.active = user.active;
          userWithRole.last_login = user.last_login;
          userWithRole.superadmin = superadmin;

          var projectsRoles = await UserService.findUserRole(user.projects);
          userWithRole.projects = projectsRoles.sort((a, b) => b.id - a.id);

          if (userWithRole) {
            return res.status(200).json(userWithRole);
          }
        }
      } else {
        return res.status(404).json({ message: "Project has already been deleted or was never assigned to the user" });
      }
    }
  },
  getSettings: async function(req, res) {
    if (isNaN(req.params.id)) {
      return res.status(400).json({ error: "User id is not valid number" });
    }
    var user_exists = await UserService.checkIfUserExistById(req.params.id);
    if (!user_exists) {
      return res.status(404).json({ error: "User doesn't exist" });
    }
    var settings = await UserService.getSettings(req.params.id);
    if (settings) {
      return res.status(200).json(settings);
    } else {
      return res.status(500).json({ error: "Something went wrong" });
    }
  },
  updateSettings: async function(req, res) {
    if (isNaN(req.params.id)) {
      return res.status(400).json({ error: "User id is not valid number" });
    }
    var user_exists = await UserService.checkIfUserExistById(req.params.id);
    if (!user_exists) {
      return res.status(404).json({ error: "User doesn't exist" });
    }
    const { errors, isValid } = validateSettingsInput(req.body);
    // Check Validation
    if (!isValid) {
      return res.status(400).json(errors);
    }
    var settingsObj = {};

    if (req.body.view_mode !== "undefined") {
      settingsObj.testcase_view_mode = req.body.view_mode;
    }
    if (req.body.show_filters !== "undefined") {
      settingsObj.testcase_show_filters = req.body.show_filters;
    }

    var updateSettings = await UserService.updateSettings(req.params.id, settingsObj);
    if (updateSettings) {
      var settings = await UserService.getSettings(req.params.id);
      return res.status(200).json(settings);
    } else {
      return res.status(500).json({ error: "Something went wrong" });
    }
  }
};
