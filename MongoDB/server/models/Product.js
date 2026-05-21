const mongoose = require("mongoose");
const productSchema = new mongoose.Schema({
  product_name: {
    type: String,
    required: true,
  },
});
const ProductModel = mongoose.model("products", productSchema); //This will automatically create collections/tables
module.exports = ProductModel;