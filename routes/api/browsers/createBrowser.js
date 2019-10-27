const Router = require("express").Router;
const passport = require("passport");
const BrowserControler = require("../../../controllers/browser");

// @route POST api/browsers/browser
// @desc create browser route
// @access public
module.exports = Router({ mergeParams: true }).post(
  "/browsers/browser",
  passport.authenticate("jwt", { session: false }),
  BrowserControler.createBrowser
);
