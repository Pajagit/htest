const Router = require("express").Router;
const passport = require("passport");
const TestCase = require("../../../models/testcase");
const Link = require("../../../models/link");
const UploadedFile = require("../../../models/uploadedfile");
const TestStep = require("../../../models/teststep");
const Group = require("../../../models/group");
const GroupTestCase = require("../../../models/grouptestcase");
const Color = require("../../../models/color");

const validateTestCaseInput = require("../../../validation/testcase");

// @route PUT api/testcases/:id
// @desc Update test case by id
// @access private
module.exports = Router({ mergeParams: true }).put(
  "/testcases/testcase/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    if (isNaN(req.params.id)) {
      res.status(400).json({ error: "Test case id is not valid number" });
    } else {
      const { errors, isValid } = validateTestCaseInput(req.body);
      // Check Validation
      if (!isValid) {
        return res.status(400).json(errors);
      }

      // Get fields
      const testCaseFields = {};
      const updateOldCaseField = {};

      if (req.body.title) testCaseFields.title = req.body.title;
      if (req.body.isDeprecated) {
        updateOldCaseField.deprecated = true;
        testCaseFields.user_id = req.body.user_id ? req.body.user_id : 1;
        testCaseFields.project_id = req.body.project_id ? req.body.project_id : 1;
      }
      testCaseFields.description = req.body.description ? req.body.description : null;
      testCaseFields.deprecated = req.body.isDeprecated ? req.body.isDeprecated : false;
      testCaseFields.preconditions = req.body.preconditions ? req.body.preconditions : null;
      if (req.body.expected_result) testCaseFields.expected_result = req.body.expected_result;
      var test_steps = req.body.test_steps.filter(Boolean);
      if (req.body.links) {
        var links = req.body.links.filter(Boolean);
      }

      // check if testcase exists
      async function checkIfTestCaseExist() {
        return new Promise((resolve, reject) => {
          TestCase.findOne({
            where: {
              id: req.params.id,
              deprecated: false
            }
          }).then(testcase => {
            if (testcase) {
              resolve(true);
            } else {
              resolve(false);
            }
          });
        });
      }

      async function updateOrCreateTestCase() {
        return new Promise((resolve, reject) => {
          console.log(testCaseFields.deprecated);
          if (!testCaseFields.deprecated) {
            TestCase.update(testCaseFields, {
              where: { id: req.params.id },
              returning: true,
              plain: true
            })
              .then(UpdatedTestCase => {
                resolve(req.params.id);
              })
              .catch(err => console.log(err));
          } else {
            TestCase.update(updateOldCaseField, {
              where: { id: req.params.id },
              returning: true,
              plain: true
            }).then(UpdatedTestCase => {
              TestCase.create({
                title: testCaseFields.title,
                description: testCaseFields.description,
                preconditions: testCaseFields.preconditions,
                expected_result: testCaseFields.expected_result,
                project_id: testCaseFields.project_id,
                user_id: testCaseFields.user_id
              }).then(testcase => {
                if (testcase) {
                  console.log(testcase.id);
                  resolve(testcase.id);
                } else {
                  resolve(false);
                }
              });
            });
          }
        });
      }

      async function removeTestSteps(updatedTestCase) {
        return new Promise((resolve, reject) => {
          if (updatedTestCase) {
            TestStep.destroy({
              where: {
                test_case_id: updatedTestCase
              }
            }).then(afectedRows => {
              resolve(true);
            });
          } else {
            resolve(false);
          }
        });
      }

      async function removeLinks(updatedTestCase) {
        return new Promise((resolve, reject) => {
          if (updatedTestCase) {
            Link.destroy({
              where: {
                test_case_id: updatedTestCase
              }
            }).then(afectedRows => {
              resolve(true);
            });
          } else {
            resolve(false);
          }
        });
      }

      async function removeGroups(updatedTestCase) {
        return new Promise((resolve, reject) => {
          if (updatedTestCase) {
            GroupTestCase.destroy({
              where: {
                test_case_id: updatedTestCase
              }
            }).then(afectedRows => {
              resolve(true);
            });
          } else {
            resolve(false);
          }
        });
      }

      async function addTestSteps(hasTestSteps, removedTestSteps, updatedTestCase) {
        return new Promise((resolve, reject) => {
          if (hasTestSteps && removedTestSteps) {
            var arrayTestSteps = new Array();
            for (var i = 0; i < test_steps.length; i++) {
              arrayTestSteps.push({
                test_case_id: updatedTestCase,
                title: test_steps[i]
              });
            }
            TestStep.bulkCreate(arrayTestSteps).then(steps => {
              resolve(true);
            });
          } else {
            resolve(true);
          }
        });
      }

      async function addLinks(hasLinks, removedLinks, updatedTestCase) {
        return new Promise((resolve, reject) => {
          if (hasLinks && removedLinks) {
            var arrayLinks = new Array();
            for (var i = 0; i < links.length; i++) {
              arrayLinks.push({
                test_case_id: updatedTestCase,
                value: links[i]
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

      async function addGroups(hasGroups, removedGroups, updatedTestCase) {
        return new Promise((resolve, reject) => {
          if (hasGroups && removedGroups) {
            var arrayGroups = new Array();
            for (var i = 0; i < req.body.groups.length; i++) {
              arrayGroups.push({
                test_case_id: updatedTestCase,
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

      async function returnUpdatedTestCase(addTestSteps, addedLinks, addedGroups, updatedTestCase) {
        return new Promise((resolve, reject) => {
          if (addTestSteps && addedLinks && addedGroups) {
            TestCase.findOne({
              attributes: ["id", "title", "description", "expected_result", "preconditions", "created_at"],
              where: {
                id: updatedTestCase
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
              order: [[Group, "id", "ASC"]]
            }).then(testcase => {
              if (testcase) {
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
                  groups: groupsObj
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
        let checkEntityExistance = await checkIfTestCaseExist();
        if (!checkEntityExistance) {
          res.status(404).json({ error: "Test case doesn't exist" });
        } else {
          let updatedTestCase = await updateOrCreateTestCase();

          //update steps
          let removedTestSteps = await removeTestSteps(updatedTestCase);
          var hasTestSteps = false;
          if (test_steps) {
            hasTestSteps = true;
          }
          let addedTestSteps = await addTestSteps(hasTestSteps, removedTestSteps, updatedTestCase);

          //update links
          let removedLinks = await removeLinks(updatedTestCase);
          var hasLinks = false;
          if (links) {
            hasLinks = true;
          }
          let addedLinks = await addLinks(hasLinks, removedLinks, updatedTestCase);

          //update groups
          let removedGroups = await removeGroups(updatedTestCase);
          var hasGroups = false;
          if (req.body.groups) {
            hasGroups = true;
          }
          let addedGroups = await addGroups(hasGroups, removedGroups, updatedTestCase);

          let testcase = await returnUpdatedTestCase(addedTestSteps, addedLinks, addedGroups, updatedTestCase);

          res.json(testcase);
        }
      })();
    }
  }
);
