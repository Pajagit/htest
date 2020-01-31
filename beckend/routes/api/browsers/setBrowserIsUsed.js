const Router = require("express").Router;
const passport = require("passport");
const BrowserControler = require("../../../controllers/browser");

// @route PUT api/browsers/browser/:id/isused
// @desc Set environment as deprecated route
// @access public
module.exports = Router({ mergeParams: true }).put(
  "/browsers/browser/:id/isused",
  passport.authenticate("jwt", { session: false }),
  BrowserControler.setBrowserIsUsed
);
