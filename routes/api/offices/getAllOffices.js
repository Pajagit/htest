const Router = require("express").Router;
const passport = require("passport");
const Office = require("../../../models/office");

// @route GET api/offices/
// @desc all offices route
// @access public
module.exports = Router({ mergeParams: true }).get(
  "/offices",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Office.findAll({
      attributes: ["id", "city"],
      order: [["id", "ASC"]]
    }).then(offices => {
      res.json(offices);
    });
  }
);
