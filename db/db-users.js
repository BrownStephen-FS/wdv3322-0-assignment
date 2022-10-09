const mongoose = require("mongoose");
const User = require("../api/model/user");

const findUser = async (user) => {
  return await User.findOne(user);
};

const saveUser = async (user) => {
  return await user.save();
};
/*
const connect = async () => {};
const disconnect = async () => {};
*/
module.exports = { findUser, saveUser };
