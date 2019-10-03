const Router = require("express").Router;
const passport = require("passport");
const Role = require("../../../models/role");

// @route GET api/roles/role/:id
// @desc Get role by id
// @access Private
module.exports = Router({ mergeParams: true }).get(
  "/roles/role/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    if (isNaN(req.params.id)) {
      res.status(400).json({ error: "Role id is not valid number" });
    } else {
      Role.findOne({
        attributes: ["id", "title"],
        where: {
          id: req.params.id
        },
        order: [["id", "DESC"]]
      })
        .then(role => {
          if (role) {
            res.status(200).json(role);
          } else {
            res.status(404).json({ message: "Role doesn't exist" });
          }
        })
        .catch(err => console.log(err));
    }
  }
);
