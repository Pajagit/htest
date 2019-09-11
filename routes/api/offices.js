const express = require("express");
const router = express.Router();
const keys = require("../../config/keys");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const pgURI = require("../../config/keys").postgresURI;
const sequelize = new Sequelize(pgURI);

const Office = require("../../models/office");

// @route GET api/offices/test
// @desc test offices route
// @access public
router.get("/test", (req, res) => {
  res.json({ message: "offices are working" });
});

// @route GET api/offices/
// @desc all offices route
// @access public

router.get("/", (req, res) => {
  Office.findAll({
    attributes: ["id", "city"],
    order: [["id", "ASC"]]
  }).then(offices => {
    res.json(offices);
  });
});

module.exports = router;
