const jwt = require("jsonwebtoken");
const messages = require("../messages/messages");
require("dotenv").config();

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.key);
    req.userData = decoded;
    next();
  } catch (err) {
    console.log(err);
    res.status(401).json({
      message: messages.authFailed,
    });
  }
};
