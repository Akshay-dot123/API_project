// const { models } = require("./models");
// console.log(models);
const express = require("express");
const app = express();
// require("dotenv").config();
const router = require("./route/index");
app.use(express.static("public"));
app.use(express.json());
app.use(router);

app.listen(3000, () => {
  console.log("Server Listening");
});
