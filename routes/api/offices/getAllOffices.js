const Router = require("express").Router;

const Office = require("../../../models/office");

// @route GET api/offices/
// @desc all offices route
// @access public
module.exports = Router({ mergeParams: true }).get("/offices", (req, res) => {
  Office.findAll({
    attributes: ["id", "city"],
    order: [["id", "ASC"]]
  }).then(offices => {
    res.json(offices);
  });
});
