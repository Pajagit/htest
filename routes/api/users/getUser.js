const Router = require("express").Router;
const passport = require("passport");
const User = require("../../../models/user");
const Project = require("../../../models/project");

// @route GET api/users/user/:id
// @desc Get one user by id
// @access private
module.exports = Router({ mergeParams: true }).get(
  "/users/user/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    if (isNaN(req.params.id)) {
      res.status(400).json({ error: "User id is not valid number" });
    } else {
      const errors = {};
      User.findOne({
        where: {
          id: req.params.id
        },
        attributes: ["id", "email", "first_name", "last_name", "position", "image_url", "active", "last_login"],
        include: [
          {
            model: Project,
            attributes: ["id", "title"],
            through: {
              attributes: []
            },
            as: "projects",
            required: false
          }
        ],
        order: [[Project, "id", "DESC"]],
        plain: true
      })
        .then(user => {
          if (!user) {
            errors.nouser = "user doesn't exist";
            res.status(404).json(errors);
          } else {
            res.json(user);
          }
        })
        .catch(err => res.status(404).json(err));
    }
  }
);
