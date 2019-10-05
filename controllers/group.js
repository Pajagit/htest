const Group = require("../models/group");
const Color = require("../models/color");

module.exports.getGroup = (req, res) => {
  if (isNaN(req.params.id)) {
    res.status(400).json({ error: "Group id is not valid number" });
  } else {
    Group.findOne({
      attributes: ["id", "pinned", "title"],
      where: {
        id: req.params.id
      },
      include: [
        {
          model: Color,
          as: "color",
          attributes: ["title"],
          required: true
        }
      ]
    })
      .then(group => {
        if (group) {
          var groupObject = {
            id: group.id,
            isPinned: group.pinned,
            title: group.title,
            color: group.color.title
          };
          res.status(200).json(groupObject);
        } else {
          res.status(404).json({ message: "Group doesn't exist" });
        }
      })
      .catch(err => console.log(err));
  }
};
