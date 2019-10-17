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
const validateTestCaseFilter = require("../../../validation/testcase").validateTestCaseFilter;
const UserService = require("../../../services/user");
const paginate = require("../../../utils/pagination").paginate;

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
      (async () => {
        var whereStatement = {};
        var whereStatementGroups = {};
        var whereStatementUsers = {};
        var requestObject = {};

        requestObject.groups = req.body.groups ? req.body.groups : [];
        requestObject.users = req.body.users ? req.body.users : [];
        requestObject.date_from = req.body.date_from ? req.body.date_from : "";
        requestObject.date_to = req.body.date_to ? req.body.date_to : "";
        requestObject.search_term = req.body.search_term ? req.body.search_term : "";
        requestObject.page = page = req.query.page;
        requestObject.page_size = pageSize = req.query.page_size;

        const { errors, isValid } = validateTestCaseFilter(requestObject);

        // Check Validation
        if (!isValid) {
          return res.status(400).json(errors);
        }

        var getTestCase = await UserService.getTestCase(req.user, req.query.project_id);
        if (!getTestCase) {
          return res.status(403).json({ message: "Forbidden" });
        }

        if (requestObject.date_from && requestObject.date_to) {
          whereStatement.created_at = {
            [Op.gte]: new Date(requestObject.date_from),
            [Op.lte]: new Date(requestObject.date_to)
          };
        } else {
          if (requestObject.date_to) {
            whereStatement.created_at = { [Op.lte]: new Date(requestObject.date_to) };
          } else {
            if (requestObject.date_from) {
              whereStatement.created_at = { [Op.gte]: new Date(requestObject.date_from) };
            }
          }
        }
        if (requestObject.groups.length > 0) {
          whereStatementGroups.id = { [Op.in]: requestObject.groups };
        }
        if (requestObject.users.length > 0) {
          whereStatementUsers.id = { [Op.in]: requestObject.users };
        }
        if (requestObject.search_term.length > 0) {
          whereStatement.title = {
            [Op.iLike]: "%" + requestObject.search_term + "%"
          };
        }
        whereStatement.project_id = req.query.project_id;
        whereStatement.deprecated = false;

        var testCaseIds = await new Promise(resolve => {
          TestCase.findAndCountAll({
            attributes: ["id"],
            where: whereStatement,
            order: [["created_at", "DESC"]],
            ...paginate({ page, pageSize })
          }).then(testcase_ids => {
            var ids = [];
            if (testcase_ids.rows) {
              testcase_ids.rows.forEach(testcase_id => {
                ids.push(testcase_id.id);
              });
            }
            resolve({ ids, count: testcase_ids.count });
          });
        });
        whereStatement.id = {
          [Op.in]: testCaseIds.ids
        };
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
          order: [["created_at", "DESC"]]
        }).then(testcases => {
          if (testcases) {
            testcasesRes = {};
            testcasesRes.pages = Math.ceil(testCaseIds.count / pageSize);
            var testcasesObjArray = Array();
            testcases.forEach(testcase => {
              var inFilteredGroup = true;
              if (requestObject.groups.length > 0) {
                var testcaseGroups = [];
                testcase.groups.forEach(group => {
                  testcaseGroups.push(group.id);
                });
                if (!requestObject.groups.every(r => testcaseGroups.includes(r))) {
                  inFilteredGroup = false;
                }
              }

              if (inFilteredGroup) {
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
                  date: getLocalTimestamp(testcase.created_at),
                  links: testcase.links,
                  uploaded_files: testcase.uploaded_files,
                  test_steps: testcase.test_steps,
                  groups: groupsObj,
                  author: testcase.user
                };
                testcasesObjArray.push(testcasesObj);
              }

              testcasesRes.testcases = testcasesObjArray;
            });
            res.json(testcasesRes);
          } else {
            res.status(200);
          }
        });
      })();
    }
  }
);
