const Router = require("express").Router;
const passport = require("passport");
const Office = require("../../../models/office");

// @route GET api/offices/search
// @desc search offices by city route
// @access public
module.exports = Router({ mergeParams: true }).get(
  "/offices/search",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Office.findAll({
      attributes: ["id", "city"],
      where: {
        city: req.query.city
      }
    }).then(offices => {
      res.json(offices);
    });
  }
);
