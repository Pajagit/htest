const Router = require("express").Router;
const passport = require("passport");
const User = require("../../../models/user");
const Project = require("../../../models/project");
const TestCase = require("../../../models/testcase");
const getLocalTimestamp = require("../../../utils/dateFunctions").getLocalTimestamp;
const UserService = require("../../../services/user");

// @route GET api/users
// @desc Get all users
// @access Private
module.exports = Router({ mergeParams: true }).get(
  "/users",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    (async () => {
      var getUsers = await UserService.getUsers(req.user);
      if (!getUsers) {
        return res.status(403).json({ message: "Forbidden" });
      }
      var includeArray = [
        {
          model: Project,
          attributes: ["id", "title"],
          through: {
            attributes: []
          },
          as: "projects",
          required: false
        }
      ];
      if (req.query.has_testcases == "true") {
        var whereCondition = {
          deprecated: false
        };
        if (req.query.project_id) {
          whereCondition.project_id = req.query.project_id;
        }
        includeArray.push({
          model: TestCase,
          where: whereCondition,
          attributes: [],
          required: true
        });
      }

      User.findAll({
        attributes: ["id", "email", "first_name", "last_name", "position", "image_url", "active", "last_login"],

        include: includeArray,
        order: [["id", "DESC"], [Project, "id", "ASC"]]
      }).then(users => {
        if (users) {
          users.forEach(user => {
            user.last_login = getLocalTimestamp(user.last_login);
          });
          res.json(users);
        } else {
          res.status(200);
        }
      });
    })();
  }
);
