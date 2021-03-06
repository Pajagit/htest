const Router = require("express").Router;
const passport = require("passport");
const TestCase = require("../../../models/testcase");
const Link = require("../../../models/link");
const UploadedFile = require("../../../models/uploadedfile");
const TestStep = require("../../../models/teststep");
const Group = require("../../../models/group");
const GroupTestCase = require("../../../models/grouptestcase");
const Color = require("../../../models/color");
const User = require("../../../models/user");

const validateTestCaseInput = require("../../../validation/testcase").validateTestCaseInput;
const UserService = require("../../../services/user");

// @route POST api/testcases/testcase
// @desc Create new testcase
// @access Private
module.exports = Router({ mergeParams: true }).post(
  "/testcases/testcase",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validateTestCaseInput(req.body);

    // Check Validation
    if (!isValid) {
      return res.status(400).json(errors);
    }

    // Get fields
    const testCaseFields = {};
    if (req.body.title) testCaseFields.title = req.body.title;
    testCaseFields.user_id = req.user.id;
    if (req.body.project_id) testCaseFields.project_id = req.body.project_id;

    testCaseFields.description = req.body.description ? req.body.description : null;
    testCaseFields.preconditions = req.body.preconditions ? req.body.preconditions : null;
    if (req.body.expected_result) testCaseFields.expected_result = req.body.expected_result;
    if (req.body.test_steps.length > 0) {
      var test_steps = req.body.test_steps;
    }

    if (req.body.links) {
      var links = req.body.links.filter(Boolean);
    }

    async function createTestCase() {
      return new Promise((resolve, reject) => {
        TestCase.create({
          title: testCaseFields.title,
          description: testCaseFields.description,
          preconditions: testCaseFields.preconditions,
          expected_result: testCaseFields.expected_result,
          project_id: testCaseFields.project_id,
          user_id: testCaseFields.user_id
        }).then(testcase => {
          if (testcase) {
            resolve(testcase);
          } else {
            resolve(false);
          }
        });
      });
    }

    async function addLinks(hasLinks, testcase) {
      return new Promise((resolve, reject) => {
        if (hasLinks) {
          var arrayLinks = new Array();
          for (var i = 0; i < links.length; i++) {
            arrayLinks.push({
              test_case_id: testcase.id,
              value: links[i].value,
              title: links[i].title
            });
          }
          Link.bulkCreate(arrayLinks).then(links => {
            resolve(true);
          });
        } else {
          resolve(true);
        }
      });
    }

    async function addGroups(hasGroups, testcase) {
      return new Promise((resolve, reject) => {
        if (hasGroups) {
          var arrayGroups = new Array();
          for (var i = 0; i < req.body.groups.length; i++) {
            arrayGroups.push({
              test_case_id: testcase.id,
              group_id: req.body.groups[i]
            });
          }
          GroupTestCase.bulkCreate(arrayGroups).then(groups => {
            resolve(true);
          });
        } else {
          resolve(true);
        }
      });
    }

    async function addTestSteps(hasTestSteps, testcase) {
      return new Promise((resolve, reject) => {
        if (hasTestSteps) {
          var arrayTestSteps = new Array();

          for (var i = 0; i < test_steps.length; i++) {
            arrayTestSteps.push({
              test_case_id: testcase.id,
              title: test_steps[i].value,
              expected_result: test_steps[i].expected_result
            });
          }
          TestStep.bulkCreate(arrayTestSteps).then(teststeps => {
            if (teststeps) {
              resolve(true);
            } else {
              resolve(false);
            }
          });
        } else {
          resolve(true);
        }
      });
    }

    async function returnCreatedTestCase(addTestSteps, addGroups, addLinks, addedTestCase) {
      return new Promise((resolve, reject) => {
        if (addTestSteps && addGroups && addLinks) {
          TestCase.findOne({
            attributes: ["id", "title", "description", "expected_result", "preconditions", "created_at"],
            where: {
              id: addedTestCase.id
            },
            include: [
              {
                model: Link,
                attributes: ["id", "value", "title"],
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
                attributes: ["id", "first_name", "last_name", "position", "email"],
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
            order: [
              [Group, "id", "ASC"],
              [{ model: TestStep, as: "test_steps" }, "id", "ASC"]
            ]
          }).then(testcase => {
            if (testcase) {
              if (testcase.groups) {
                var groupsObj = Array();
                testcase.groups.forEach(group => {
                  var groupObject = {
                    id: group.id,
                    pinned: group.pinned,
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
              resolve(testcasesObj);
            } else {
              resolve(false);
            }
          });
        }
      });
    }

    (async () => {
      var canCreateTestCase = await UserService.canCreateUpdateTestCase(req.user, req.body.project_id);
      if (!canCreateTestCase) {
        return res.status(403).json({ message: "Forbidden" });
      }
      let createdTestCase = await createTestCase();
      if (createdTestCase) {
        //links
        var hasLinks = false;
        if (links) {
          hasLinks = true;
        }
        let addedLinks = await addLinks(hasLinks, createdTestCase);
        //groups
        var hasGroups = false;
        if (req.body.groups) {
          hasGroups = true;
        }
        let addedGroups = await addGroups(hasGroups, createdTestCase);
        //test steps
        var hasTestSteps = false;
        if (test_steps) {
          hasTestSteps = true;
        }
        let addedTestSteps = await addTestSteps(hasTestSteps, createdTestCase);

        let createdTestCaseObj = await returnCreatedTestCase(addedLinks, addedGroups, addedTestSteps, createdTestCase);

        res.json(createdTestCaseObj);
      } else {
        res.status(500).json({ error: "An error occured while creating test case" });
      }
    })();
  }
);
