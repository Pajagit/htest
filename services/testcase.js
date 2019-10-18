const Sequelize = require("sequelize");
const pgURI = require("../config/keys").postgresURI;
const sequelize = new Sequelize(pgURI);
const Op = Sequelize.Op;
const User = require("../models/user");
const Color = require("../models/color");
const TestStep = require("../models/teststep");
const TestCase = require("../models/testcase");
const Link = require("../models/link");
const UploadedFile = require("../models/uploadedfile");
const Group = require("../models/group");
const paginate = require("../utils/pagination").paginate;

const getLocalTimestamp = require("../utils/dateFunctions").getLocalTimestamp;

module.exports = {
  getTestcasesIds: async function(whereStatement, page, pageSize, requestObject) {
    return new Promise((resolve, reject) => {
      groupCondition = " ";
      userCondition = " ";
      dateToCondition = " ";
      dateFromCondition = " ";
      searchTermCondition = " ";

      if (requestObject.groups.length > 0) {
        requestObject.groups.forEach(group => {
          groupCondition =
            groupCondition +
            ' and "testcases"."id" in (select "test_case_id" from "grouptestcases" where "group_id" =' +
            group +
            ")";
        });
      }
      if (requestObject.date_to) {
        dateToCondition = ' and "created_at" <=' + requestObject.date_to;
      }
      if (requestObject.date_from) {
        dateFromCondition = ' and "created_at" >=' + requestObject.date_from;
      }
      if (requestObject.search_term.length > 0) {
        searchTermCondition = ' and "title" ilike \'%' + requestObject.search_term + "%'";
      }
      if (requestObject.users.length > 0) {
        userCondition = 'and "user_id" in (' + requestObject.users + ")";
      }
      sequelize
        .query(
          'select "id" from "testcases" where "deprecated" = false ' +
            groupCondition +
            userCondition +
            dateToCondition +
            dateFromCondition +
            searchTermCondition +
            'order by "created_at" desc offset ' +
            page * pageSize +
            " limit " +
            pageSize,
          { type: sequelize.QueryTypes.SELECT }
        )
        .then(testcases => {
          var testcase_ids = [];
          if (testcases) {
            testcases.forEach(testcase_id => {
              testcase_ids.push(testcase_id.id);
            });
          }
          resolve({ ids: testcase_ids, count: testcases.length });
        });
    });
  },
  getTestcases: async function(testCaseIds, whereStatement, whereStatementUsers, requestObject) {
    return new Promise((resolve, reject) => {
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
        order: [["created_at", "DESC"], [{ model: TestStep, as: "test_steps" }, "id", "ASC"], [Group, "id", "ASC"]]
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
          resolve(testcasesRes);
        } else {
          resolve([]);
        }
      });
    });
  }
};
