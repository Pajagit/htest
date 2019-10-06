const Router = require("express").Router;
const passport = require("passport");
const GroupController = require("../../../controllers/group");

// @route PUT api/groups/group/:id
// @desc Update group by id
// @access private
module.exports = Router({ mergeParams: true }).put(
  "/groups/group/:id",
  passport.authenticate("jwt", { session: false }),
  GroupController.updateGroup
);
