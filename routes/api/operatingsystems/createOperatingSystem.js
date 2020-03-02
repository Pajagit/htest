const Router = require("express").Router;
const passport = require("passport");
const OsControler = require("../../../controllers/operatingsystem");

// @route POST api/operatingsystems/operatingsystem
// @desc create os route
// @access public
module.exports = Router({ mergeParams: true }).post(
  "/operatingsystems/operatingsystem",
  passport.authenticate("jwt", { session: false }),
  OsControler.createOS
);
