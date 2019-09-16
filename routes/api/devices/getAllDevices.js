const Router = require("express").Router;

const Device = require("../../../models/device");
const Office = require("../../../models/office");

// @route GET api/devices/
// @desc all devices route
// @access public
module.exports = Router({ mergeParams: true }).get("/devices", (req, res) => {
  if (isNaN(req.query.office_id)) {
    res.status(400).json({ error: "Office id is not valid number" });
  } else {
    Device.findAll({
      attributes: ["id", "title", "resolution", "dpi", "udid", "screen_size", "retina", "simulator", "deleted"],
      where: {
        deleted: false
      },
      include: [
        {
          model: Office,
          attributes: ["id", "city"],
          required: false
        }
      ],
      order: [["title", "ASC"], [Office, "id", "ASC"]]
    }).then(devices => {
      res.json(devices);
    });
  }
});
