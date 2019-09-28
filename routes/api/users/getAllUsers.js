const Router = require("express").Router;
const passport = require("passport");
const User = require("../../../models/user");
const Project = require("../../../models/project");
const TestCase = require("../../../models/testcase");
const getLocalTimestamp = require("../../../utils/dateFunctions").getLocalTimestamp;

// @route GET api/users
// @desc Get all users
// @access Private
module.exports = Router({ mergeParams: true }).get(
  "/users",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
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
      includeArray.push({
        model: TestCase,
        where: {
          deprecated: false
        },
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
  }
);
