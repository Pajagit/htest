const Router = require("express").Router;
const passport = require("passport");
const BrowserControler = require("../../../controllers/browser");

// @route DELETE api/browsers/browser/:id/deprecated
// @desc set browser as deprecated route
// @access public
module.exports = Router({ mergeParams: true }).put(
  "/browsers/browser/:id/deprecated",
  passport.authenticate("jwt", { session: false }),
  BrowserControler.setBrowserAsDeprecated
);
