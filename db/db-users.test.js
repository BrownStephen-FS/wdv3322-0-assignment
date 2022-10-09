const mongoose = require("mongoose");
const User = require("../api/model/user");
const { connect, disconnect, findUser, saveUser } = require("./db-users");

const user = new User({
  _id: mongoose.Types.ObjectId(),
  firstName: "userFirstName",
  lastName: "userLastName",
  address: "userAddress",
  city: "userCity",
  state: "userState",
  zip: "userZip",
  email: "userEmail",
  password: "userPassword",
});

beforeEach(async () => {
  await connect();
});

describe("MongoDB Users Tests", () => {
  test("Testing the saveUser function", async () => {
    const testUser = await saveUser(user);

    expect(testUser.firstName).toEqual("userFirstName");
    expect(testUser.lastName).toEqual("userLastName");
    expect(testUser.address).toEqual("userAddress");
    expect(testUser.city).toEqual("userCity");
    expect(testUser.state).toEqual("userState");
    expect(testUser.zip).toEqual("userZip");
    expect(testUser.email).toEqual("userEmail");
    expect(testUser.password).toEqual("userPassword");
  });

  test("Testing the findUser function", async () => {
    const testUser = await findUser(user);

    expect(testUser.firstName).toEqual("userFirstName");
    expect(testUser.lastName).toEqual("userLastName");
    expect(testUser.address).toEqual("userAddress");
    expect(testUser.city).toEqual("userCity");
    expect(testUser.state).toEqual("userState");
    expect(testUser.zip).toEqual("userZip");
    expect(testUser.email).toEqual("userEmail");
    expect(testUser.password).toEqual("userPassword");
  });
});

afterEach(async () => {
  await disconnect();
  console.log("disconnected");
});
