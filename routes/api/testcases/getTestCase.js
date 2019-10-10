const Router = require("express").Router;
const passport = require("passport");
const TestCase = require("../../../models/testcase");
const Link = require("../../../models/link");
const UploadedFile = require("../../../models/uploadedfile");
const TestStep = require("../../../models/teststep");
const Group = require("../../../models/group");
const Color = require("../../../models/color");
const User = require("../../../models/user");
const UserService = require("../../../services/user");

// @route GET api/testcases/:id
// @desc Get one test case by id
// @access private
module.exports = Router({ mergeParams: true }).get(
  "/testcases/testcase/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    if (isNaN(req.params.id)) {
      res.status(400).json({ error: "Test case id is not valid number" });
    } else {
      const errors = {};
      TestCase.findOne({
        where: {
          id: req.params.id,
          deprecated: false
        },
        attributes: ["id", "title", "description", "expected_result", "preconditions", "created_at", "project_id"],
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
            attributes: ["id", "title", "pinned"],
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
        order: [[Group, "id", "ASC"]][[TestStep, "id", "DESC"]]
      })
        .then(testcase => {
          if (!testcase) {
            errors.notestcase = "Test case doesn't exist";
            res.status(404).json(errors);
          } else {
            (async () => {
              var getTestCase = await UserService.getTestCase(req.user, testcase.project_id);
              if (!getTestCase) {
                return res.status(403).json({ message: "Forbiden" });
              }
              if (testcase.groups) {
                var groupsObj = Array();
                testcase.groups.forEach(group => {
                  var groupObject = {
                    id: group.id,
                    isPinned: group.pinned,
                    title: group.title,
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
              res.json(testcasesObj);
            })();
          }
        })
        .catch(err => res.status(404).json(err));
    }
  }
);
