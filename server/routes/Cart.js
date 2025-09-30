import express from "express";
import { addToCart, getCart, deleteCartItem } from "../controller/Cart.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// Apply authMiddleware to all cart routes
router.use(authMiddleware);

router.post("/", addToCart);
router.get("/", getCart);
router.delete("/:productId", deleteCartItem);

export default router;
