import Cart from "../models/Cart.js";

export const addToCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId, quantity } = req.body;

    if (!productId) {
      return res.status(400).json({ message: "Product ID is required" });
    }

    const qty = quantity && quantity > 0 ? quantity : 1;

    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      cart = new Cart({
        user: userId,
        products: [{ product: productId, quantity: qty }],
      });
    } else {
      // Check if product already in cart
      const productIndex = cart.products.findIndex(
        (p) => p.product.toString() === productId
      );

      if (productIndex > -1) {
        // If product exists, update quantity
        cart.products[productIndex].quantity += qty;
      } else {
        // Else, push new product
        cart.products.push({ product: productId, quantity: qty });
      }
    }

    await cart.save();
    const populatedCart = await Cart.findById(cart._id).populate(
      "products.product"
    );

    res
      .status(200)
      .json({ message: "Product added to cart", cart: populatedCart });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Failed to add to cart", error: err.message });
  }
};
// GET /api/cart - Get current user's cart
export const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id }).populate(
      "products.product"
    );

    if (!cart) {
      return res.status(200).json({ products: [] });
    }

    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: "Failed to get cart", error });
  }
};

// DELETE /api/cart/:productId - Remove product from cart
export const deleteCartItem = async (req, res) => {
  try {
    const { productId } = req.params;

    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.products = cart.products.filter(
      (item) => item.product.toString() !== productId
    );

    await cart.save();

    res.status(200).json({ message: "Item removed from cart", cart });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete cart item", error });
  }
};
