const Router = require("express").Router;
const passport = require("passport");
const TestCase = require("../../../models/testcase");
const Link = require("../../../models/link");
const UploadedFile = require("../../../models/uploadedfile");
const TestStep = require("../../../models/teststep");
const Group = require("../../../models/group");
const Color = require("../../../models/color");
const User = require("../../../models/user");

// @route GET api/testcases
// @desc Get all testcases
// @access Private
module.exports = Router({ mergeParams: true }).get(
  "/testcases",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    if (isNaN(req.query.project_id)) {
      res.status(400).json({ error: "Project id is not valid number" });
    } else {
      TestCase.findAll({
        attributes: ["id", "title", "description", "expected_result", "preconditions", "created_at"],
        where: {
          project_id: req.query.project_id,
          deprecated: false
        },
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
            as: "user"
          },
          {
            model: Group,
            attributes: ["id", "title", "color_id", "pinned"],
            through: {
              attributes: []
            },
            as: "groups",
            required: false,
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
              date: testcase.created_at,
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
