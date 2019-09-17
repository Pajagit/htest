const Router = require("express").Router;

const Browser = require("../../../models/browser");

// @route GET api/browsers/
// @desc all offices route
// @access public
module.exports = Router({ mergeParams: true }).get("/browsers", (req, res) => {
  Browser.findAll({
    attributes: ["id", "title", "screen_resolution", "version", "deleted"],
    where: {
      deleted: false
    },
    order: [["title", "ASC"]]
  }).then(browsers => {
    res.json(browsers);
  });
});
