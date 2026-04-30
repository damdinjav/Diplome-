const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

dotenv.config();

const authRoutes = require("./src/routes/authRoutes");
const productRoutes = require("./src/routes/productRoutes");
//const orderRoutes = require("./src/routes/orderRoutes");

const app = express();

app.use(cors());
app.use(express.json());

const path = require("path");
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
//app.use("/api/orders", orderRoutes);

app.get("/", (req, res) => {
  res.send("Generator Ordering System API is running...");
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(process.env.PORT, () => {
      console.log(`Server running on port ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.error("Database connection error:", err.message);
  });