import Product from "../models/Product.js";
import Category from "../models/Product.js";

// @desc    Get all products with filtering, sorting and pagination
// @route   GET /api/products
// @access  Public
export const getProducts = async (req, res) => {
  try {
    const products = await Product.find({}).populate("category");
    res.json({ success: true, data: products });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
  try {
    const {
      category,
      featured,
      trending,
      search,
      minPrice,
      maxPrice,
      sort,
      page = 1,
      limit = 12,
      inStock,
    } = req.query;

    // Build query object
    let query = { isActive: true };

    // Category filter
    if (category) {
      const categoryDoc = await Category.findOne({
        $or: [
          { _id: category },
          { slug: category },
          { name: { $regex: category, $options: "i" } },
        ],
      });
      if (categoryDoc) {
        query.category = categoryDoc._id;
      }
    }

    // Boolean filters
    if (featured === "true") query.featured = true;
    if (trending === "true") query.trending = true;
    if (inStock === "true") query.inventory = { $gt: 0 };

    // Price range filter
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseInt(minPrice);
      if (maxPrice) query.price.$lte = parseInt(maxPrice);
    }

    // Search filter
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { tags: { $in: [new RegExp(search, "i")] } },
      ];
    }

    // Sort options
    let sortOptions = {};
    switch (sort) {
      case "price_asc":
        sortOptions.price = 1;
        break;
      case "price_desc":
        sortOptions.price = -1;
        break;
      case "newest":
        sortOptions.createdAt = -1;
        break;
      case "popular":
        sortOptions.ratings = -1;
        break;
      case "name_asc":
        sortOptions.name = 1;
        break;
      case "name_desc":
        sortOptions.name = -1;
        break;
      default:
        sortOptions.createdAt = -1;
    }

    // Pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Execute query
    const products = await Product.find(query)
      .populate("category")
      .sort(sortOptions)
      .skip(skip)
      .limit(limitNum);

    // Get total count for pagination
    const total = await Product.countDocuments(query);

    res.json({
      success: true,
      count: products.length,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
      data: products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

// @desc    Get single product by ID
// @route   GET /api/products/:id
// @access  Public
export const getProductById = async (req, res) => {
  console.log(req.params, "params");

  try {
    const product = await Product.findById(req.params.id).populate("category");
    // .populate("reviews.user", "name email");//Reviews

    // if (!product || !product.isActive) {
    //   return res.status(404).json({
    //     success: false,
    //     message: "Product not found",
    //   });
    // }

    res.json({
      success: true,
      data: product,
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

// @desc    Get featured products
// @route   GET /api/products/featured
// @access  Public
export const getFeaturedProducts = async (req, res) => {
  try {
    const products = await Product.getFeatured();

    res.json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

// @desc    Get trending products
// @route   GET /api/products/trending
// @access  Public
export const getTrendingProducts = async (req, res) => {
  try {
    const products = await Product.find({
      trending: true,
      isActive: true,
      inventory: { $gt: 0 },
    })
      .populate("category")
      .limit(8)
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

// @desc    Get products by category
// @route   GET /api/products/category/:category
// @access  Public
export const getProductsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const { sort, limit = 20, populate = "true" } = req.query;

    const categoryDoc = await Category.findOne({
      $or: [
        { _id: category },
        { slug: category },
        { name: { $regex: category, $options: "i" } },
      ],
    });

    if (!categoryDoc) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    let sortOptions = {};
    if (sort === "price_asc") sortOptions.price = 1;
    else if (sort === "price_desc") sortOptions.price = -1;
    else sortOptions.createdAt = -1;

    let query = Product.find({ category: categoryDoc._id });

    // Populate category details if requested
    if (populate === "true") {
      query = query.populate("category", "name description slug");
    }

    const products = await query.sort(sortOptions).limit(parseInt(limit));

    res.json({
      success: true,
      category: categoryDoc,
      count: products.length,
      data: products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

// @desc    Search products
// @route   GET /api/products/search/:query
// @access  Public
export const searchProducts = async (req, res) => {
  try {
    const { query } = req.params;
    const products = await Product.search(query);

    res.json({
      success: true,
      query,
      count: products.length,
      data: products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

// @desc    Create a new product (Admin only)
// @route   POST /api/products
// @access  Private/Admin
export const createProduct = async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();

    await product.populate("category");

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: product,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        success: false,
        message: "Validation Error",
        errors: messages,
      });
    }
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

// @desc    Update a product (Admin only)
// @route   PUT /api/products/:id
// @access  Private/Admin
export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate("category");

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.json({
      success: true,
      message: "Product updated successfully",
      data: product,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        success: false,
        message: "Validation Error",
        errors: messages,
      });
    }
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

// @desc    Delete a product (Admin only)
// @route   DELETE /api/products/:id
// @access  Private/Admin
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Soft delete (set isActive to false)
    product.isActive = false;
    await product.save();

    res.json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};
