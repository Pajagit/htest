const ProjectService = require("../services/project");
const UserService = require("../services/user");
const RoleService = require("../services/role");

const validateUserInput = require("../validation/user").validateUserInput;

module.exports = {
  createUser: async function(req, res) {
    // Get fields
    const userFields = {};

    userFields.email = req.body.email;
    userFields.first_name = req.body.first_name ? req.body.first_name : null;
    userFields.last_name = req.body.last_name ? req.body.last_name : null;
    userFields.position = req.body.position ? req.body.position : null;
    userFields.image_url = req.body.image_url ? req.body.image_url : null;
    userFields.superadmin = req.body.superadmin ? req.body.superadmin : null;

    const { errors, isValid } = validateUserInput(req.body, null, false);
    // Check Validation
    if (!isValid) {
      return res.status(400).json(errors);
    }
    var canUpdateUser = await UserService.getCreateUpdateUser(req.user);
    if (!canUpdateUser) {
      return res.status(403).json({ message: "Forbiden" });
    }
    var userExists = await UserService.checkIfUserWithSameMailExist(req.body.email);
    if (userExists) {
      return res.status(400).json({ error: "User already exist" });
    } else {
      var createdUser = await UserService.createUser(userFields);
      if (createdUser) {
        var setAsSuperadmin = await UserService.setAsSuperadmin(
          userFields.superadmin,
          createdUser,
          await RoleService.getSuperadminRoleId()
        );
        if (setAsSuperadmin) {
          var createdUserObj = await UserService.returnCreatedUser(createdUser);
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
        var canUpdateUser = await UserService.getCreateUpdateUser(req.user);
        if (!canUpdateUser) {
          return res.status(403).json({ message: "Forbiden" });
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
          let user = await UserService.returnUpdatedUser(updatedUser[1]);
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

          if (userWithRole) {
            return res.status(200).json(userWithRole);
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

    var canUpdateUser = await UserService.getCreateUpdateUser(req.user);
    if (!canUpdateUser) {
      return res.status(403).json({ message: "Forbiden" });
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
  }
};
