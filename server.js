const express = require("express");
const bodyParser = require("body-parser");

const testcases = require("./routes/api/testcases");

const app = express();
app.use(bodyParser.json());

app.use("/api/testcases", testcases);

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server running on port ${port}`));
