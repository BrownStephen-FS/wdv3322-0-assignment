const express = require("express");
const router = express.Router();
const messages = require("../../messages/messages");

router.post("/signup", (req, res) => {
  res.status(200).json({
    message: messages.signUp,
  });
});

router.post("/login", (req, res) => {
  res.status(200).json({
    message: messages.logIn,
  });
});

router.get("/profile", (req, res) => {
  res.status(200).json({
    message: messages.profile,
  });
});

module.exports = router;
