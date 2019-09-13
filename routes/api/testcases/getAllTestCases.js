const Router = require("express").Router;

const TestCase = require("../../../models/testcase");
const Link = require("../../../models/link");
const UploadedFile = require("../../../models/uploadedfile");
const TestStep = require("../../../models/teststep");
const Group = require("../../../models/group");

// @route GET api/testcases
// @desc Get all testcases
// @access Private
module.exports = Router({ mergeParams: true }).get("/testcases", (req, res) => {
  console.log("asd");
  if (isNaN(req.query.project_id)) {
    res.status(400).json({ error: "Project id is not valid number" });
  } else {
    TestCase.findAll({
      attributes: ["id", "title", "description", "expected_result", "preconditions", ["created_at", "date"]],
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
          model: Group,
          attributes: ["id", ["title", "value"], "color"],
          through: {
            attributes: []
          },
          as: "groups",
          required: false
        }
      ],
      order: [["created_at", "DESC"]]
    }).then(testcases => {
      if (testcases) {
        res.json(testcases);
      } else {
        res.status(200);
      }
    });
  }
});
