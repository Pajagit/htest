const Router = require("express").Router;
const passport = require("passport");
const BrowserControler = require("../../../controllers/browser");

// @route PUT api/browsers/browser/:id
// @desc create browser route
// @access public
module.exports = Router({ mergeParams: true }).put(
  "/browsers/browser/:id",
  passport.authenticate("jwt", { session: false }),
  BrowserControler.updateBrowser
);
