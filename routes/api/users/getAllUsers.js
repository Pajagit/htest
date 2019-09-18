const Router = require("express").Router;
const passport = require("passport");
const User = require("../../../models/user");
const Project = require("../../../models/project");
const UserRoleProject = require("../../../models/userroleproject");

// @route GET api/users
// @desc Get all users
// @access Private
module.exports = Router({ mergeParams: true }).get(
  "/users",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    User.findAll({
      attributes: ["id", "email", "first_name", "last_name", "position", "image_url", "active"],
      include: [
        {
          model: Project,
          attributes: ["id", "title"],
          through: {
            attributes: []
          },
          as: "projects",
          required: false
        }
      ],
      order: [["id", "DESC"], [Project, "id", "ASC"]]
    }).then(users => {
      if (users) {
        // var testcasesObjArray = Array();
        // testcases.forEach(testcase => {
        //   if (testcase.groups) {
        //     var groupsObj = Array();
        //     testcase.groups.forEach(group => {
        //       var groupObject = {
        //         id: group.id,
        //         isPinned: group.pinned,
        //         name: group.title,
        //         color: group.color.title
        //       };
        //       groupsObj.push(groupObject);
        //     });
        //   }
        //   var testcasesObj = {
        //     id: testcase.id,
        //     title: testcase.title,
        //     description: testcase.description,
        //     expected_result: testcase.expected_result,
        //     preconditions: testcase.preconditions,
        //     date: testcase.created_at,
        //     links: testcase.links,
        //     uploaded_files: testcase.uploaded_files,
        //     test_steps: testcase.test_steps,
        //     groups: groupsObj,
        //     author: testcase.user
        //   };
        //   testcasesObjArray.push(testcasesObj);
        // });
        res.json(users);
      } else {
        res.status(200);
      }
    });
  }
);
