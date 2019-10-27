const Router = require("express").Router;
const passport = require("passport");
const BrowserControler = require("../../../controllers/browser");

// @route GET api/browsers/browser/:id
// @desc Get browser by id route
// @access public
module.exports = Router({ mergeParams: true }).get(
  "/browsers/browser/:id",
  passport.authenticate("jwt", { session: false }),
  BrowserControler.getBrowser
);
