const Router = require("express").Router;
const passport = require("passport");
const { Op } = require("sequelize");
const TestCase = require("../../../models/testcase");
const Link = require("../../../models/link");
const UploadedFile = require("../../../models/uploadedfile");
const TestStep = require("../../../models/teststep");
const Group = require("../../../models/group");
const Color = require("../../../models/color");
const User = require("../../../models/user");
const getLocalTimestamp = require("../../../utils/dateFunctions").getLocalTimestamp;

// @route POST api/testcases
// @desc POST all testcases
// @access Private
module.exports = Router({ mergeParams: true }).post(
  "/testcases",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    if (isNaN(req.query.project_id)) {
      res.status(400).json({ error: "Project id is not valid number" });
    } else {
      whereStatement = {};
      whereStatementGroups = {};
      whereStatementUsers = {};

      var groups = req.body.groups ? req.body.groups : [];
      var users = req.body.users ? req.body.users : [];

      if (req.body.dateFrom && req.body.dateTo) {
        whereStatement.created_at = { [Op.gte]: new Date(req.body.dateFrom), [Op.lte]: new Date(req.body.dateTo) };
      } else {
        if (req.body.dateTo) {
          whereStatement.created_at = { [Op.lte]: new Date(req.body.dateTo) };
        } else {
          if (req.body.dateFrom) {
            whereStatement.created_at = { [Op.gte]: new Date(req.body.dateFrom) };
          }
        }
      }
      if (groups.length > 0) {
        whereStatementGroups.id = { [Op.in]: groups };
      }
      if (users.length > 0) {
        whereStatementUsers.id = { [Op.in]: users };
      }
      whereStatement.project_id = req.query.project_id;
      whereStatement.deprecated = false;

      TestCase.findAll({
        attributes: ["id", "title", "description", "expected_result", "preconditions", "created_at"],
        where: whereStatement,
        include: [
          {
            model: Link,
            attributes: ["id", "value"],
            required: false
          },
          {
            model: UploadedFile,
            attributes: ["id", ["title", "value"], "path"],
            required: false,
            as: "uploaded_files"
          },
          {
            model: TestStep,
            attributes: ["id", ["title", "value"], "expected_result"],
            required: false,
            as: "test_steps"
          },
          {
            model: User,
            attributes: ["id", "first_name", "last_name", "position"],
            required: true,
            as: "user",
            where: whereStatementUsers
          },
          {
            model: Group,
            attributes: ["id", "title", "color_id", "pinned"],
            through: {
              attributes: []
            },
            as: "groups",
            where: whereStatementGroups,
            required: true,
            include: [
              {
                model: Color,
                as: "color",
                attributes: ["title"],
                required: true
              }
            ]
          }
        ],
        order: [["created_at", "DESC"], [Group, "id", "ASC"]]
      }).then(testcases => {
        if (testcases) {
          var testcasesObjArray = Array();
          testcases.forEach(testcase => {
            if (testcase.groups) {
              var groupsObj = Array();
              testcase.groups.forEach(group => {
                var groupObject = {
                  id: group.id,
                  isPinned: group.pinned,
                  name: group.title,
                  color: group.color.title
                };
                groupsObj.push(groupObject);
              });
            }
            var testcasesObj = {
              id: testcase.id,
              title: testcase.title,
              description: testcase.description,
              expected_result: testcase.expected_result,
              preconditions: testcase.preconditions,
              date: getLocalTimestamp(testcase.created_at),
              links: testcase.links,
              uploaded_files: testcase.uploaded_files,
              test_steps: testcase.test_steps,
              groups: groupsObj,
              author: testcase.user
            };
            testcasesObjArray.push(testcasesObj);
          });
          res.json(testcasesObjArray);
        } else {
          res.status(200);
        }
      });
    }
  }
);
