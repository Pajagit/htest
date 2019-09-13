const Router = require("express").Router;

const TestCase = require("../../../models/testcase");
const Link = require("../../../models/link");
const UploadedFile = require("../../../models/uploadedfile");
const TestStep = require("../../../models/teststep");
const Group = require("../../../models/group");
const GroupTestCase = require("../../../models/grouptestcase");

const validateTestCaseInput = require("../../../validation/testcase");

// @route PUT api/testcases/:id
// @desc Update test case by id
// @access private
module.exports = Router({ mergeParams: true }).put("/testcases/testcase/:id", (req, res) => {
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
    if (req.body.title) testCaseFields.title = req.body.title;
    testCaseFields.description = req.body.description ? req.body.description : null;
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
            id: req.params.id
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

    async function updateTestCase() {
      return new Promise((resolve, reject) => {
        TestCase.update(testCaseFields, {
          where: { id: req.params.id },
          returning: true,
          plain: true
        })
          .then(UpdatedTestCase => {
            resolve(true);
          })
          .catch(err => console.log(err));
      });
    }

    async function removeTestSteps(updatedTestCase) {
      return new Promise((resolve, reject) => {
        if (updatedTestCase) {
          TestStep.destroy({
            where: {
              test_case_id: req.params.id
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
              test_case_id: req.params.id
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
              test_case_id: req.params.id
            }
          }).then(afectedRows => {
            resolve(true);
          });
        } else {
          resolve(false);
        }
      });
    }

    async function addTestSteps(hasTestSteps, removedTestSteps) {
      return new Promise((resolve, reject) => {
        if (hasTestSteps && removedTestSteps) {
          var arrayTestSteps = new Array();
          for (var i = 0; i < test_steps.length; i++) {
            arrayTestSteps.push({
              test_case_id: req.params.id,
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

    async function addLinks(hasLinks, removedLinks) {
      return new Promise((resolve, reject) => {
        if (hasLinks && removedLinks) {
          var arrayLinks = new Array();
          for (var i = 0; i < links.length; i++) {
            arrayLinks.push({
              test_case_id: req.params.id,
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

    async function addGroups(hasGroups, removedGroups) {
      return new Promise((resolve, reject) => {
        if (hasGroups && removedGroups) {
          var arrayGroups = new Array();
          for (var i = 0; i < req.body.groups.length; i++) {
            arrayGroups.push({
              test_case_id: req.params.id,
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

    async function returnUpdatedTestCase(addTestSteps, addedLinks, addedGroups) {
      return new Promise((resolve, reject) => {
        if (addTestSteps && addedLinks && addedGroups) {
          TestCase.findOne({
            attributes: ["id", "title", "description", "expected_result", "preconditions", ["created_at", "date"]],
            where: {
              id: req.params.id
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
                attributes: ["id", ["title", "value"], "color"],
                through: {
                  attributes: []
                },
                as: "groups",
                required: false
              }
            ]
          }).then(testcase => {
            resolve(testcase);
          });
        }
      });
    }

    (async () => {
      let checkEntityExistance = await checkIfTestCaseExist();
      if (!checkEntityExistance) {
        res.status(404).json({ error: "Test case doesn't exist" });
      } else {
        let updatedTestCase = await updateTestCase();

        //update steps
        let removedTestSteps = await removeTestSteps(updatedTestCase);
        var hasTestSteps = false;
        if (test_steps) {
          hasTestSteps = true;
        }
        let addedTestSteps = await addTestSteps(hasTestSteps, removedTestSteps);

        //update links
        let removedLinks = await removeLinks(updatedTestCase);
        var hasLinks = false;
        if (links) {
          hasLinks = true;
        }
        let addedLinks = await addLinks(hasLinks, removedLinks);

        //update groups
        let removedGroups = await removeGroups(updatedTestCase);
        var hasGroups = false;
        if (req.body.groups) {
          hasGroups = true;
        }
        let addedGroups = await addGroups(hasGroups, removedGroups);

        let testcase = await returnUpdatedTestCase(addedTestSteps, addedLinks, addedGroups);

        res.json(testcase);
      }
    })();
  }
});
