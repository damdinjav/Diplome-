const Order = require("../models/Order");
const Product = require("../models/Product");

// Захиалга үүсгэх
const createOrder = async (req, res) => {
  try {
    const { productId, quantity, note } = req.body;

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Бүтээгдэхүүн олдсонгүй" });
    if (product.stock < quantity) return res.status(400).json({ message: "Нөөц хүрэлцэхгүй байна" });

    const totalPrice = product.price * quantity;

    const order = await Order.create({
      user: req.user.id,
      product: productId,
      quantity,
      totalPrice,
      note: note || "",
    });

    product.stock -= quantity;
    await product.save();

    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Миний захиалгууд
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .populate("product", "name brand powerKW image")
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Бүх захиалга (admin)
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("product", "name brand")
      .populate("user", "fullName email")
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Захиалга цуцлах
const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Захиалга олдсонгүй" });
    if (order.user.toString() !== req.user.id)
      return res.status(403).json({ message: "Зөвшөөрөлгүй" });
    if (order.status !== "Хүлээгдэж буй")
      return res.status(400).json({ message: "Энэ захиалгыг цуцлах боломжгүй" });

    order.status = "Цуцлагдсан";
    await order.save();

    // Нөөц буцаах
    const product = await Product.findById(order.product);
    if (product) {
      product.stock += order.quantity;
      await product.save();
    }

    res.json({ message: "Захиалга цуцлагдлаа" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Захиалгын статус өөрчлөх (admin)
const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!order) return res.status(404).json({ message: "Захиалга олдсонгүй" });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { createOrder, getMyOrders, getAllOrders, cancelOrder, updateOrderStatus };