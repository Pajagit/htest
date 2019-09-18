const Router = require("express").Router;
const passport = require("passport");
const Device = require("../../../models/device");
const Office = require("../../../models/office");

// @route GET api/devices/
// @desc all devices route
// @access public
module.exports = Router({ mergeParams: true }).get(
  "/devices",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    var whereStatement = {};
    if (req.query.office_id) {
      if (isNaN(req.query.office_id)) {
        res.status(400).json({ error: "Office id is not valid number" });
      } else {
        whereStatement.office_id = req.query.office_id;
      }
    }
    whereStatement.deleted = false;
    Device.findAll({
      attributes: ["id", "title", "resolution", "dpi", "udid", "screen_size", "retina", "simulator", "deleted"],
      where: whereStatement,
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
);
