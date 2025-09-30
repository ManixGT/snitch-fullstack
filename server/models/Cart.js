// models/cart.model.js
import mongoose from "mongoose";
import cartSchema from "../schema/Cart.js";

const Cart = mongoose.model("Cart", cartSchema);
export default Cart;
