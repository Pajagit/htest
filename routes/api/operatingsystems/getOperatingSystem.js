const Router = require("express").Router;
const passport = require("passport");
const OsController = require("../../../controllers/operatingsystem");

// @route GET api/operatingsystems/operatingsystem/:id
// @desc get os by id route
// @access public
module.exports = Router({ mergeParams: true }).get(
  "/operatingsystems/operatingsystem/:id",
  passport.authenticate("jwt", { session: false }),
  OsController.getOS
);
