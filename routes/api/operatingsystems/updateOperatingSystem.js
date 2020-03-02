const Router = require("express").Router;
const passport = require("passport");
const OsControler = require("../../../controllers/operatingsystem");

// @route PUT api/operatingsystems/operatingsystem/:id
// @desc create os route
// @access public
module.exports = Router({ mergeParams: true }).put(
  "/operatingsystems/operatingsystem/:id",
  passport.authenticate("jwt", { session: false }),
  OsControler.updateOS
);
