const Router = require("express").Router;
const passport = require("passport");
const BrowserControler = require("../../../controllers/browser");

// @route DELETE api/browsers/browser/:id
// @desc delete browser route
// @access public
module.exports = Router({ mergeParams: true }).delete(
  "/browsers/browser/:id",
  passport.authenticate("jwt", { session: false }),
  BrowserControler.deleteBrowser
);
