const Router = require("express").Router;
const passport = require("passport");
const isEmpty = require("../../../validation/is-empty");
const User = require("../../../models/user");
const UserService = require("../../../services/user");

// @route PUT api/users/user/:id/activation
// @desc Deactivate user by user id
// @access private
module.exports = Router({ mergeParams: true }).put(
  "/users/user/:id/activation",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    (async () => {
      if (isNaN(req.params.id || isEmpty(req.params.id))) {
        res.status(400).json({ error: "User id is not valid number" });
      } else {
        if (typeof req.body.active !== "boolean") {
          res.status(400).json({ error: "Parameter 'active' must have a value" });
        } else {
          var canActivateUser = await UserService.getCreateUpdateUser(req.user);
          if (!canActivateUser) {
            return res.status(403).json({ message: "Forbidden" });
          }
          User.findOne({
            where: {
              id: req.params.id
            }
          }).then(user => {
            if (!isEmpty(user)) {
              userFields = {};
              userFields.active = req.body.active;
              userFields.updated_at = new Date();
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
    })();
  }
);
