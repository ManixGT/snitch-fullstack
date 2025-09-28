import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
      maxlength: [100, "Product name cannot exceed 100 characters"],
    },
    description: {
      type: String,
      required: [true, "Product description is required"],
      maxlength: [1000, "Description cannot exceed 1000 characters"],
    },
    price: {
      type: Number,
      required: [true, "Product price is required"],
      min: [0, "Price cannot be negative"],
    },
    originalPrice: {
      type: Number,
      min: [0, "Original price cannot be negative"],
    },
    images: [
      {
        type: String,
        required: [true, "At least one image is required"],
      },
    ],
    category: {
      type: String, // ← Simple string instead of reference
      required: true,
    },
    brand: {
      type: String,
      default: "Snitch",
    },
    sizes: [
      {
        type: String,
        enum: ["S", "M", "L", "XL", "XXL", "28", "30", "32", "34", "36", "38"],
        required: [true, "At least one size is required"],
      },
    ],
    colors: [
      {
        type: String,
        required: [true, "At least one color is required"],
      },
    ],
    inventory: {
      type: Number,
      required: [true, "Inventory quantity is required"],
      min: [0, "Inventory cannot be negative"],
      default: 0,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    trending: {
      type: Boolean,
      default: false,
    },
    discount: {
      type: Number,
      min: [0, "Discount cannot be negative"],
      max: [100, "Discount cannot exceed 100%"],
      default: 0,
    },
    tags: [
      {
        type: String,
      },
    ],
    ratings: {
      type: Number,
      min: [0, "Rating cannot be less than 0"],
      max: [5, "Rating cannot exceed 5"],
      default: 0,
    },
    reviews: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        rating: {
          type: Number,
          required: true,
          min: 1,
          max: 5,
        },
        comment: {
          type: String,
          maxlength: [500, "Review comment cannot exceed 500 characters"],
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

//include isActive in products as well; or out of stock is very imp. thing

// Indexes
productSchema.index({ name: "text", description: "text" });
productSchema.index({ category: 1, price: 1 });
productSchema.index({ featured: -1, trending: -1 });

// Virtual for discount percentage
productSchema.virtual("discountPercentage").get(function () {
  if (this.originalPrice && this.originalPrice > this.price) {
    return Math.round(
      ((this.originalPrice - this.price) / this.originalPrice) * 100
    );
  }
  return 0;
});

// Method to check if product is in stock
productSchema.methods.isInStock = function () {
  return this.inventory > 0;
};

// Method to update inventory
productSchema.methods.updateInventory = function (quantity) {
  if (this.inventory + quantity < 0) {
    throw new Error("Insufficient inventory");
  }
  this.inventory += quantity;
  return this.save();
};

export default productSchema;
