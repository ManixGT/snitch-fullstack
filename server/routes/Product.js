import express from "express";
import {
  getProducts,
  getProductById,
  getFeaturedProducts,
  getTrendingProducts,
  getProductsByCategory,
  searchProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controller/Product.js";

const router = express.Router();

// Public routes
router.get("/", getProducts);
router.get("/:id", getProductById);
router.get("/featured", getFeaturedProducts);
router.get("/trending", getTrendingProducts);
router.get("/category/:category", getProductsByCategory);
router.get("/search/:query", searchProducts);

// Admin routes (add authentication middleware later)
router.post("/", createProduct);
router.put("/:id", updateProduct);
router.delete("/:id", deleteProduct);

export default router;
