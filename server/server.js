import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import { configDotenv } from "dotenv";

// Load environment variables
configDotenv();

const app = express();

// Middleware
// CORS Middleware with proper configuration
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
  })
);

app.use(express.json());
app.use(express.static("public"));

// Routes
import productRoute from "./routes/Product.js";
import categoryRoutes from "./routes/Category.js";
import cartRoutes from "./routes/Cart.js";
import authRoutes from "./routes/authRoutes.js";
// import userRoutes from "./routes/users.js";
// import authRoutes from "./routes/auth.js";
// import orderRoutes from "./routes/orders.js";

app.use("/api/products", productRoute);
app.use("/api/categories", categoryRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/auth", authRoutes);
// app.use("/api/users", userRoutes);
// app.use("/api/auth", authRoutes);
// app.use("/api/orders", orderRoutes);

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URL || "mongodb://localhost:27017/snitch")
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.error("MongoDB connection error:", err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Snitch server running http://localhost:${PORT}/`)
);
