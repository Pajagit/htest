const Router = require("express").Router;
const passport = require("passport");
const OsControler = require("../../../controllers/operatingsystem");

// @route PUT api/operatingsystems/operatingsystem/:id/isused
// @desc set is used for version version route
// @access public
module.exports = Router({ mergeParams: true }).put(
  "/operatingsystems/operatingsystem/:id/isused",
  passport.authenticate("jwt", { session: false }),
  OsControler.seOsIsUsed
);
