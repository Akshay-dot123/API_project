const UserModel = require("../models/Users");
async function getUsers(req, res) {
  try {
    const data = await UserModel.find({});
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
}

async function getUser(req, res) {
  try {
    const data = await UserModel.findById(req.params.id);
    console.log("User data", data);
    res.json(data);
  } catch (err) {
    console.error("Error fetching user:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

async function createUser(req, res) {
  try {
    const user = req.body;
    console.log("New user created", user);
    const newUser = new UserModel(user);
    await newUser.save();
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
}
module.exports = { getUsers, getUser, createUser };