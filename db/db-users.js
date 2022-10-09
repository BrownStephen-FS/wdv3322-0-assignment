const mongoose = require("mongoose");
const User = require("../api/model/user");
require("dotenv").config();

const findUser = async (user) => {
  return await User.findOne(user);
};

const saveUser = async (user) => {
  return await user.save();
};

const connect = async () => {
  await mongoose.connect(process.env.mongoDBURL);
};
const disconnect = async () => {
  await mongoose.connection.close();
};

module.exports = { findUser, saveUser, connect, disconnect };
