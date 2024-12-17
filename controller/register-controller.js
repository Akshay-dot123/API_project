require("dotenv").config();
const models = require("../models");
const bcrypt = require("bcryptjs");
const Schema = require("../middleware/validation/postValidation");
const userSchema = require("../middleware/validation/userValidation");
const jwt = require("jsonwebtoken");
const validateInput = require("../util/util");
const { invalidateToken } = require("../middleware/jwt-auth");
console.log(process.env.DB_HOST);

const getRegister = async (req, res) => {
  try {
    const registers = await models.Register.findAll();
    console.log(registers);
    res.status(201).json(registers);
  } catch (error) {
    console.error("Error fetching registers:", error);
  }
};

// Dynamic bulkCreation
const isEmailUnique = async (email) => {
  const existingUser = await models.Register.findOne({ where: { email } });
  return !existingUser;
};
const postRegister = async (req, res) => {
  try {
    const registers = req.body;
    const createdRegisters = [];
    for (const reg of registers) {
      // New Validation code
      const validationError = validateInput(reg, Schema);
      if (validationError) {
        return res.status(400).send(validationError);
      }
      // const err = Schema.validate(reg);
      // if (
      //   err &&
      //   err.error &&
      //   err.error.details &&
      //   err.error.details[0] &&
      //   err.error.details[0].message
      // ) {
      //   return res.status(400).send(err.error.details[0].message);
      // }
      const isUnique = await isEmailUnique(reg.email);
      console.log("Unique Email:", isUnique);
      if (!isUnique) {
        return res.status(409).json({ message: "Email already exists." });
      }
      const hashedPassword = await bcrypt.hash(reg.password, 8);
      console.log("Hashed Password ========>", hashedPassword);
      console.log("Real Password =========>", reg.password);
      const newRegister = await models.Register.create({
        email: reg.email,
        password: hashedPassword,
      });
      createdRegisters.push(newRegister);
    }
    return res.status(201).json({
      message: "Registers created successfully",
      data: createdRegisters,
    });
  } catch (error) {
    console.error("Error in postRegister:", error);
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

// Dynamic Deletion
const deleteRegister = async (req, res) => {
  let { id } = req.body;
  try {
    if (!id) {
      return res.status(400).json({ message: "id required" });
    }
    const deleteUser = await models.User.findAll({
      where: { registerId: id },
    });
    const deleteRegister = await models.Register.findAll({ where: { id } });
    console.log(deleteRegister);
    console.log("===================>");
    console.log(deleteUser);
    if (deleteRegister === 0 && deleteUser === 0) {
      return res.status(400).json({ message: "No records deleted" });
    }
    return res.status(200).json({
      message: "Successfully deleted",
      Registered_Details: deleteRegister,
      User: deleteUser,
    });
  } catch (error) {
    console.error("Error fetching registers:", error);
  }
};

// Dynamic updation
const updateRegsiter = async (req, res) => {
  const { email, password } = req.body;
  try {
    // New Validation code
    const validationError = validateInput(req.body, Schema);
    if (validationError) {
      return res.status(400).send(validationError);
    }
    const user = await models.Register.findOne({ where: { email } });
    console.log("Got user", user);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    console.log("Old Hashed Password", user.password);
    const hashedPassword = await bcrypt.hash(password, 8);
    console.log("Recent Hashed Password ========>", hashedPassword);
    console.log("Recent changed Password =========>", password);
    const updateFields = {
      email: email,
      password: hashedPassword,
    };
    const [updatedCount] = await models.Register.update(updateFields, {
      where: { email },
    });
    console.log(updatedCount);
    res.status(201).json("Your password has been updated");
  } catch (error) {
    console.error("Error fetching registers:", error);
  }
};

// *** Login ***
function generateJWT(payload) {
  return jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: "1h" });
}

const getLogin = async (req, res) => {
  const { email, password } = req.body;
  console.log(req.body);
  const payload = req.body;
  // New Validation code
  const validationError = validateInput(payload, Schema); // Use the utility function
  if (validationError) {
    return res.status(400).send(validationError);
  }
  const token = generateJWT(payload);
  let emailFinder = await models.Register.findOne({ where: { email } });
  if (emailFinder) {
    const storedHashedPassword = emailFinder.dataValues.password;
    const isMatch = await bcrypt.compare(password, storedHashedPassword);
    if (isMatch) {
      console.log("Valid Password");
      res.json({ token });
    } else {
      console.log("Password or Email is Invalid");
      res.status(404).send("Password or Email is Invalid");
    }
  } else {
    console.log("Password or Email is Invalid");
    res.status(404).send("Password or Email is Invalid");
  }
};

// *** Logout ***
const postLogout = async (req, res) => {
  let token = req.headers["authorization"].split(" ")[1];
  if (!token) {
    return res.status(403).send({ message: "No token provided!" });
  }
  invalidateToken(token);
  res.status(200).send({
    message: "Successfully logged out",
  });
};

// *** User ***
const postUser = async (req, res, next) => {
  try {
    const Users = req.body;
    console.log(Users);
    // New Validation code
    const validationError = validateInput(req.body, userSchema); // Use the utility function
    if (validationError) {
      return res.status(400).send(validationError);
    }
    console.log("Email siktu==============>", req.user.email);
    const email = req.user.email;
    const existingRegister = await models.Register.findOne({
      where: { email },
    });
    if (!existingRegister) {
      return res.status(404).json({ message: "Register not found" });
    }
    const createdUser = await models.User.create({
      registerId: existingRegister.id,
      age: Users.age,
      date_of_birth: Users.date_of_birth,
      gender: Users.gender,
    });
    console.log(createdUser);
    res.send(createdUser);
  } catch (error) {
    if (error.name === "SequelizeUniqueConstraintError") {
      console.error("SQL Error Message:", error.parent.sqlMessage);
      return res.status(409).json({ message: error.errors[0].message });
    }
    console.error("Error fetching registers:========>", error);
  }
};

module.exports = {
  getRegister,
  postRegister,
  deleteRegister,
  updateRegsiter,
  getLogin,
  postLogout,
  postUser,
};
