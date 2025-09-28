import Category from "../models/Category.js";

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
export const getCategory = async (req, res) => {
  try {
    const categories = await Category.find({}).sort({ name: 1 });
    res.json({ success: true, data: categories });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
    throw new Error(error);
  }
};
