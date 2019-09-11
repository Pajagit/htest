const pgURI = require("./config/keys").postgresURI;
const bodyParser = require("body-parser");
const { Pool } = require("pg");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const sequelize = new Sequelize(pgURI);

const express = require("express");

const testcases = require("./routes/api/testcases");

const offices = require("./routes/api/offices");

const app = express();
// // Body parser middleware
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

app.use("/api/testcases", testcases);
app.use("/api/offices", offices);

// app.get('/', (req, res) => res.send('Hello'));
const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server running on port ${port}`));
