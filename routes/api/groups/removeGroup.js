const Router = require("express").Router;
const passport = require("passport");
const GroupController = require("../../../controllers/group");

// @route DELETE api/groups/group/:id
// @desc Delete group by id
// @access private
module.exports = Router({ mergeParams: true }).delete(
  "/groups/group/:id",
  passport.authenticate("jwt", { session: false }),
  GroupController.deleteGroup
);
