const express = require("express");
const router = express.Router();
const User = require("../model/user");
const messages = require("../../messages/messages");
const bcrypt = require("bcrypt");
const { findUser, saveUser } = require("../../db/db-users");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const checkAuth = require("../../auth/checkAuth");
require("dotenv").config();

router.post("/signup", (req, res) => {
  findUser({ email: req.body.email }).then((result) => {
    if (result) {
      res.status(403).json({ message: messages.duplicateUser });
    } else {
      bcrypt.hash(req.body.password, 10, (err, hash) => {
        if (err) {
          res.status(400).json({ message: err.message });
        } else {
          const user = new User({
            _id: mongoose.Types.ObjectId(),
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            address: req.body.address,
            city: req.body.city,
            state: req.body.state,
            zip: req.body.zip,
            email: req.body.email,
            password: hash,
          });
          saveUser(user)
            .then((result) => {
              res.status(201).json({
                message: messages.newUser,
                user: {
                  firstName: result.firstName,
                  lastName: result.lastName,
                  address: result.address,
                  city: result.city,
                  state: result.state,
                  zip: result.zip,
                  email: result.email,
                  password: result.password,
                },
              });
            })
            .catch((err) =>
              res.status(400).json({
                error: {
                  message: err.message,
                },
              })
            );
        }
      });
    }
  });
});

router.post("/login", (req, res) => {
  findUser({ email: req.body.email }).then((result) => {
    if (!result) {
      res.status(403).json({ message: messages.userNotFound });
    } else {
      const user = result;
      bcrypt.compare(req.body.password, user.password, (err, result) => {
        if (err) {
          res.status(400).json({ message: err.message });
        } else if (result) {
          const token = jwt.sign(
            { email: user.email, password: user.password },
            process.env.key
          );
          res.status(200).json({
            message: messages.loginSuccess,
            name: user.firstName,
            token: token,
          });
        } else {
          res.status(401).json({
            message: messages.invalidCreds,
          });
        }
      });
    }
  });
});

router.get("/profile", checkAuth, (req, res, next) => {
  res.status(200).json({
    message: messages.loginSuccess,
    userData: req.userData,
  });
});

module.exports = router;
