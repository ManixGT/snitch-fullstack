import express from "express";
import {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  addAddress,
  addToWishlist,
  addToCart,
} from "../controller/User.js";

const router = express.Router();

// User routes
router.get("/", getUsers);
router.get("/:id", getUserById);
router.post("/", createUser);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

// Nested routes
router.post("/:id/addresses", addAddress);
router.post("/:id/wishlist", addToWishlist);
router.post("/:id/cart", addToCart);

export default router;
