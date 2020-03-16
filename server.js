const pgURI = require("./config/keys").postgresURI;
const bodyParser = require("body-parser");
const Sequelize = require("sequelize");
var opts = {
  define: {
    //prevent sequelize from pluralizing table names
    freezeTableName: true
  }
};
const sequelize = new Sequelize(pgURI, opts);
const passport = require("passport");

const express = require("express");

const router = require("./routes/createRouter.js")();

const app = express();
// Body parser middleware
app.use(bodyParser.json());

// Passport middleware
app.use(passport.initialize());

// Passport Config
require("./config/passport")(passport);

// Check connection to postgresDB
sequelize
  .authenticate()
  .then(() => {
    console.log("Connection has been established successfully.");
  })
  .catch(err => {
    console.error("Unable to connect to the database:", err);
  });

app.use("/api", router);

const port = process.env.PORT || 5000;

var server = app.listen(port, () => console.log(`Server running on port ${port}`));
server.timeout = 30 * 1000;
