const Router = require("express").Router;

const Group = require("../../../models/group");
const Color = require("../../../models/color");

// @route GET api/groups
// @desc Get all groups
// @access Private
module.exports = Router({ mergeParams: true }).get("/groups", (req, res) => {
  if (isNaN(req.query.project_id)) {
    res.status(400).json({ error: "Project id is not valid number" });
  } else {
    Group.findAll({
      attributes: ["id", "pinned", "title"],
      where: {
        project_id: 1
      },
      include: [
        {
          model: Color,
          as: "color",
          attributes: ["title"],
          required: true
        }
      ],
      order: [["id", "ASC"]]
    }).then(groups => {
      if (groups) {
        var groupsObj = Array();
        groups.forEach(group => {
          var groupObject = {
            id: group.id,
            isPinned: group.pinned,
            name: group.title,
            color: group.color.title
          };
          groupsObj.push(groupObject);
        });

        res.json(groupsObj);
      } else {
        res.status(200);
      }
    });
  }
});
