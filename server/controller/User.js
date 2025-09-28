import userModel from "../models/User.js";

// GET all users
export const getUsers = async (req, res) => {
  try {
    const users = await userModel.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET single user by ID
export const getUserById = async (req, res) => {
  try {
    const user = await userModel
      .findById(req.params.id)
      .populate("wishlist")
      .populate("cart.product")
      .populate("orders");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// CREATE new user
export const createUser = async (req, res) => {
  try {
    const user = new userModel(req.body);
    const savedUser = await user.save();
    res.status(201).json(savedUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// UPDATE user
export const updateUser = async (req, res) => {
  try {
    const user = await userModel.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// DELETE user
export const deleteUser = async (req, res) => {
  try {
    const user = await userModel.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ADD address
export const addAddress = async (req, res) => {
  try {
    const user = await userModel.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.addresses.push(req.body);
    await user.save();

    res.json(user.addresses);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// ADD to wishlist
export const addToWishlist = async (req, res) => {
  try {
    const user = await userModel.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.wishlist.push(req.body.productId);
    await user.save();

    res.json(user.wishlist);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// ADD to cart
export const addToCart = async (req, res) => {
  try {
    const user = await userModel.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.cart.push(req.body);
    await user.save();

    res.json(user.cart);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
