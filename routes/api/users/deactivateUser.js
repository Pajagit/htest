const Router = require("express").Router;
const passport = require("passport");
const isEmpty = require("../../../validation/is-empty");
const User = require("../../../models/user");

// @route PUT api/users/user/:id/deactivate
// @desc Deactivate user by user id
// @access private
module.exports = Router({ mergeParams: true }).put(
  "/users/user/:id/deactivate",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    if (isNaN(req.params.id || isEmpty(req.params.id))) {
      res.status(400).json({ error: "User id is not valid number" });
    } else {
      User.findOne({
        where: {
          id: req.params.id
        }
      }).then(user => {
        if (!isEmpty(user)) {
          userFields = {};
          userFields.active = false;
          User.update(userFields, {
            where: { id: user.id },
            returning: true,
            plain: true
          })
            .then(user => {
              res.json(user[1]);
            })
            .catch(err => console.log(err));
        } else {
          res.status(404).json({ error: `Can not find user with this ${req.params.id} id` });
        }
      });
    }
  }
);
