const ProductModel = require("../models/Product");
async function getProducts(req, res) {
  try {
    const data = await ProductModel.find({});
    res.json(data);
  } catch (err) {
    console.error("Error fetching products", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
module.exports = { getProducts };