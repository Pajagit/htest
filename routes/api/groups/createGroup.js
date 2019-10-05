const Router = require("express").Router;
const passport = require("passport");
const GroupController = require("../../../controllers/group");

// @route POST api/groups/group
// @desc Create new group
// @access Private
module.exports = Router({ mergeParams: true }).post(
  "/groups/group",
  passport.authenticate("jwt", { session: false }),
  GroupController.createGroup
);
