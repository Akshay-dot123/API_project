const express = require("express");
const app = express();
const bcrypt = require("bcrypt");
const SALT_ROUNDS = 12;
const { authenticateToken } = require("./middleware/auth");
const { generateTokens, verifyToken } = require("./utils/tokens");
const { sequelize, user, order } = require("./models");
// const { QueryTypes } = require('sequelize');
// app.use(authenticateToken); --> This will apply to all below routes

app.post("/", async (req, res) => {
  const email = req.query.email;
  const password = req.query.password;
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }
  const oldUser = await user.findOne({
    where: { email },
  });
  if (oldUser) {
    const isValid = await bcrypt.compare(password, oldUser.password);
    if (!isValid) {
      return res.status(401).json({ error: "Invalid email or password" });
    }
    await order.create({ user_id: oldUser.id, total: "45" });

    // ✅ GENERATE TOKENS HERE using helper
    const { accessToken, refreshToken } = generateTokens(oldUser);

    // Check view table records
    const [rows] = await sequelize.query(
      "SELECT * FROM user_orders_view WHERE order_id > ? ",
      { replacements: [20] },
    );
    console.log("=============>", rows);
    return res.status(200).json({
      message: "Login successful",
      accessToken, // Client stores this securely
      refreshToken, // Client stores this securely
      user: {
        id: oldUser.id,
        email: oldUser.email,
      },
    });
  } else {
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    const newUser = await user.create({
      email,
      password: hashedPassword,
    });
    await order.create({ user_id: newUser.id, total: "45" });

    // ✅ GENERATE TOKENS HERE using helper
    const { accessToken, refreshToken } = generateTokens(newUser);
    return res.status(201).json({
      message: "Registration successful",
      accessToken,
      refreshToken,
      user: { id: newUser.id, email: newUser.email },
    });
  }
});

app.get("/hi", authenticateToken, async (req, res) => {
  res.send("hi")
  console.log("HI");
});
// Stored Procedure,Triggers etc
async function name() {
  // 🟢 Query the VIEW (no model needed)
  const [viewRows] = await sequelize.query(
    "SELECT * FROM user_orders_view WHERE user_id = ?",
    { replacements: [2] },
  );
  console.log("viewRows=====>", viewRows);

  // 🔫 TRIGGERS don't need calling. They fire automatically on INSERT/UPDATE/DELETE.
  // Note:- user_id mst be there in DB
  const a = await sequelize.query(
    "INSERT INTO orders (user_id, total, createdAt, updatedAt) VALUES (?, ?, NOW(), NOW())",
    {
      replacements: [2, 50],
    },
  );
  console.log("a===========>", a);
}
// name();

app.listen(3000, (req, res) => {
  console.log("listening to port 3000");
});
