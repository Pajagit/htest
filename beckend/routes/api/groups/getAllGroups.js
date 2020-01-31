const Router = require("express").Router;
const passport = require("passport");
const GroupController = require("../../../controllers/group");

// @route GET api/groups
// @desc Get all groups
// @access Private
module.exports = Router({ mergeParams: true }).get(
  "/groups",
  passport.authenticate("jwt", { session: false }),
  GroupController.getAllGroups
);
