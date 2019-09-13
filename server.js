const pgURI = require("./config/keys").postgresURI;
const bodyParser = require("body-parser");
const Sequelize = require("sequelize");
const sequelize = new Sequelize(pgURI);

const express = require("express");

const router = require("./routes/createRouter.js")();

const app = express();
// Body parser middleware
app.use(bodyParser.json());

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

app.listen(port, () => console.log(`Server running on port ${port}`));
