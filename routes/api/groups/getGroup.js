const Router = require("express").Router;
const passport = require("passport");
const GroupController = require("../../../controllers/group");

// @route GET api/groups/group/:id
// @desc Get group by id
// @access Private
module.exports = Router({ mergeParams: true }).get(
  "/groups/group/:id",
  passport.authenticate("jwt", { session: false }),
  GroupController.getGroupById
);
