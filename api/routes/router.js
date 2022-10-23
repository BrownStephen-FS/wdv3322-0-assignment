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

/**
 * @swagger
 * tags:
 *  name: Signup
 *  description: This is for the user signup
 * /users/signup:
 *  post:
 *      tags: [Signup]
 *      requestBody:
 *          require: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          firstName: 
 *                              type: string
 *                              default: Stephen
 *                          lastName:
 *                              type: string
 *                              default: Brown
 *                          address:
 *                              type: string
 *                              default: 123 Address Way
 *                          city:
 *                              type: string
 *                              default: Atlanta
 *                          state:
 *                              type: string
 *                              default: GA
 *                          zip:
 *                              type: string
 *                              default: 30263
 *                          email:
 *                              type: string
 *                              default: sabrown2@student.fullsail.edu
 *                          password:
 *                              type: string
 *                              default: Password123
 *      responses:
 *         201:
 *          description: Success
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                    message:
 *                        type: string
 *                        default: New user created!
 *                    user:
 *                        type: object
 *                        properties:
 *                            firstName:
 *                                type: string
 *                                default: Stephen
 *                            lastName:
 *                                type: string
 *                                default: Brown
 *                            address:
 *                                type: string
 *                                default: 123 Address Way
 *                            city:
 *                                type: string
 *                                default: Atlanta
 *                            state:
 *                                type: string
 *                                default: GA
 *                            zip:
 *                                type: string
 *                                default: 30263
 *                            email:
 *                                type: string
 *                                default: sabrown2@student.fullsail.edu
 *                            password:
 *                                type: string
 *                                default: $2b$10$V.RmfHzqQIEHsUlW6m0g5ewQcNHoKN1/rlLuYLs4Vvw5wVNFuvfim
 *         403:
 *          description: Forbidden
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                    message:
 *                        type: string
 *                        default: Duplicate User! Change email and try again.
 * 
 * @swagger
 * tags:
 *  name: Login
 *  description: This is for the user login
 * /users/login:
 *  post:
 *      tags: [Login]
 *      requestBody:
 *          require: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          email: 
 *                              type: string
 *                              default: sabrown2@student.fullsail.edu
 *                          password:
 *                              type: string
 *                              default: Password123
 *      responses:
 *         200:
 *          description: Success
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                    message:
 *                        type: string
 *                        default: Login Successful
 *                    name:
 *                        type: string
 *                        default: Stephen
 *                    token:
 *                        type: string
 *                        default: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InNhYnJvd24yQHN0dWRlbnQuZnVsbHNhaWwuZWR1IiwicGFzc3dvcmQiOiIkMmIkMTAkakhuZnp3N1hpWlBFRHF4NnYvQXMwT2cyYTJZQlYwTFBVQklPUFpnT0ZMaHRiNTBaaDJzNnEiLCJpYXQiOjE2NjY0ODkyNDZ9.FJeJObExnPul02KcQ5xR3AHQWiMooLZ8aup2pPA5K5Y
 *         401:
 *          description: Unauthorized
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                    message:
 *                        type: string
 *                        default: Invalid Credentials! Check password and try again.
 * 
 *  @swagger
 * tags:
 *  name: Profile
 *  description: This is for user profile
 * /users/profile:
 *  get:
 *      tags: [Profile]
 *      responses:
 *         200:
 *          description: Success
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                    message:
 *                        type: string
 *                        default: Login Successful
 *                    user:
 *                        type: object
 *                        properties:
 *                            email: 
 *                                type: string
 *                                default: sabrown2@student.fullsail.edu
 *                            password:
 *                                type: string
 *                                default: $2b$10$U39N7R..8nZRknawfgUS..5uYGKBNS51gZJCKKP.zuLVqgPUOE4AC
 *                            name:
 *                                type: string
 *                                default: Stephen
 *         401:
 *          description: Unauthorized
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                    message:
 *                        type: string
 *                        default: Authorization Failed.
 */

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
            { email: user.email, password: user.password, name: user.firstName },
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
