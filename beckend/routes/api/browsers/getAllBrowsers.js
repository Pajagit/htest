const Router = require("express").Router;
const passport = require("passport");
const BrowserControler = require("../../../controllers/browser");

// @route GET api/browsers
// @desc all browsers route
// @access public
module.exports = Router({ mergeParams: true }).get(
  "/browsers",
  passport.authenticate("jwt", { session: false }),
  BrowserControler.getAllBrowsers
);
