const express = require("express");
const router = require("../api/routes/router");
const app = express();
const mongoose = require("mongoose");
const messages = require("../messages/messages");
require("dotenv").config();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/users", router);

app.get("/", (req, res, next) => {
  res.status(200).json({
    message: messages.serverUp,
    method: req.method,
  });
});

app.use((req, res, next) => {
  const error = new Error(messages.notFound);
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500).json({
    error: {
      message: error.message,
      status: error.status,
      method: req.method,
    },
  });
});

mongoose.connect(process.env.mongoDBURL, (err) => {
  if (err) {
    console.error("Error: ", err.message);
  } else {
    console.log(messages.connectionSuccessful);
  }
});

module.exports = app;
