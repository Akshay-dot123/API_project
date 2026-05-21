const express = require("express");
const router = express.Router();
const { getUsers, getUser, createUser } = require("../controllers/userController");
router.get("/getUsers", getUsers);
router.get("/getUser/:id", getUser);
router.post("/createUser", createUser);

module.exports = router;
