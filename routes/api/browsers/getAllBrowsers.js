const Router = require("express").Router;

const Office = require("../../../models/browser");

// @route GET api/browsers/
// @desc all offices route
// @access public
module.exports = Router({ mergeParams: true }).get("/browsers", (req, res) => {
  Office.findAll({
    attributes: ["id", "title", "screen_resolution", "version", "deleted"],
    where: {
      deleted: false
    },
    order: [["title", "ASC"]]
  }).then(browsers => {
    res.json(browsers);
  });
});
