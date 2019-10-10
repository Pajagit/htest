const Router = require("express").Router;
const passport = require("passport");
const isEmpty = require("../../../validation/is-empty");
const TestCase = require("../../../models/testcase");
const UserService = require("../../../services/user");

// @route PUT api/testcases/:id/deprecated
// @desc Update test case by id and set as deprecated
// @access private
module.exports = Router({ mergeParams: true }).put(
  "/testcases/testcase/:id/deprecated",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    if (isNaN(req.params.id || isEmpty(req.params.id))) {
      res.status(400).json({ error: "Test case id is not valid number" });
    } else {
      TestCase.findOne({
        where: {
          id: req.params.id
        }
      }).then(testcase => {
        (async () => {
          if (!isEmpty(testcase)) {
            var canCreateTestCase = await UserService.canCreateUpdateTestCase(req.user, testcase.project_id);
            if (!canCreateTestCase) {
              return res.status(403).json({ message: "Forbiden" });
            }
            testCaseFields = {};
            testCaseFields.deprecated = true;
            TestCase.update(testCaseFields, {
              where: { id: testcase.id },
              returning: true,
              plain: true
            })
              .then(testcase => {
                res.json(testcase[1]);
              })
              .catch(err => console.log(err));
          } else {
            res.status(404).json({ error: `Can not find test case with this ${req.params.id} id` });
          }
        })();
      });
    }
  }
);
