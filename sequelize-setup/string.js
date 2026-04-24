const client = require("./client");
const axios = require("axios");
const express = require("express");
const app = express();

// Real world example
app.get("/", async (req, res) => {
  const cacheValue = await client.get("todos");
  if (cacheValue) return res.json(JSON.parse(cacheValue));

  const { data } = await axios.get(
    "https://jsonplaceholder.typicode.com/todos",
  );
  await client.set("todos", JSON.stringify(data));
  await client.expire("todos", 30); // Will expire in 30 sec
  return res.json(data);
});
app.listen(8000, () => {
  console.log("Listening to PORT:8000");
});

// We can also use fetch but its requires some more manual setup. So we use axios.For ex:
// Axios
const newProduct = await axios.post("https://api.example.com/products", {
  name: "Laptop",
  price: 999,
});
// Fetch (equivalent)
const response = await fetch("https://api.example.com/products", {
  method: "POST",
  headers: {
    "Content-Type": "application/json", // ⚠️ Must set manually
  },
  body: JSON.stringify({
    // ⚠️ Must stringify manually
    name: "Laptop",
    price: 999,
  }),
});

// Basic example
async function init() {
  await client.set("msg:1", "Hey from Nodejs");
  const res = await client.get("msg:1");
  console.log(res);
}
init();
