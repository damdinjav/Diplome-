const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    quantity: { type: Number, required: true, min: 1 },
    totalPrice: { type: Number, required: true },
    note: { type: String, default: "" },
    status: {
      type: String,
      enum: ["Хүлээгдэж буй", "Батлагдсан", "Хүргэгдсэн", "Цуцлагдсан"],
      default: "Хүлээгдэж буй",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);