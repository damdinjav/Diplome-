const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    brand: { type: String, required: true },
    powerKW: { type: Number, required: true },
    type: { type: String, required: true },
    price: { type: Number, required: true },
    stock: { type: Number, default: 0 },
    description: { type: String, default: "" },
    image: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);