import mongoose from "mongoose";
import productSchema from "../schema/Product.js";

// Static method to get featured products
productSchema.statics.getFeatured = function () {
  return this.find({ featured: true }).limit(10);
};

// Static method to get products by category
productSchema.statics.getByCategory = function (categoryId) {
  return this.find({ category: categoryId });
};

// Static method to search products
productSchema.statics.search = function (query) {
  return this.find({
    $or: [
      { name: { $regex: query, $options: "i" } },
      { description: { $regex: query, $options: "i" } },
      { tags: { $in: [new RegExp(query, "i")] } },
    ],
  });
};

// Static method to get trending products
productSchema.statics.getTrending = function (limit = 8) {
  return this.find({ trending: true, inventory: { $gt: 0 } })
    .limit(limit)
    .sort({ createdAt: -1 });
};

const Product = mongoose.model("Product", productSchema);

export default Product;
