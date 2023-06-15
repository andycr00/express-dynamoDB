const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const { routes } = require("./user/routes");

app.use(bodyParser.json());
app.use("/users", routes);

module.exports = {
  app,
};
