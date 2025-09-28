import cloudinary from "cloudinary";
import mongoose from "mongoose";
import Product from "../models/Product.js";
import Category from "../models/Category.js";
import { configDotenv } from "dotenv";

configDotenv();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Connect to MongoDB with error handling
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("✅ MongoDB connected successfully"))
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  });

const getImagesFromFolder = async (folderName) => {
  try {
    const result = await cloudinary.api.resources({
      type: "upload",
      prefix: folderName,
      max_results: 100,
    });

    console.log(`📸 Found ${result.resources.length} images in ${folderName}`);
    return result.resources.map((resource) => resource.secure_url);
  } catch (error) {
    console.error(
      `❌ Error fetching images from ${folderName}:`,
      error.message
    );
    return [];
  }
};

// Realistic product templates
const productTemplates = {
  shirts: {
    names: [
      "Classic Cotton Shirt",
      "Formal White Shirt",
      "Casual Button Down",
      "Office Wear Shirt",
    ],
    descriptions: [
      "Premium cotton shirt with modern fit for professional look",
      "Comfortable daily wear shirt perfect for office and casual outings",
    ],
    priceRange: [999, 2499],
    sizes: ["S", "M", "L", "XL"],
    colors: ["White", "Blue", "Black", "Grey"],
  },
  tshirts: {
    names: [
      "Basic Cotton T-Shirt",
      "Premium Crew Neck",
      "Fashion Tee",
      "Casual T-Shirt",
    ],
    descriptions: [
      "100% cotton soft t-shirt for ultimate comfort",
      "Perfect fit t-shirt for daily casual wear",
    ],
    priceRange: [499, 1499],
    sizes: ["S", "M", "L", "XL"],
    colors: ["Black", "White", "Navy", "Grey"],
  },
  jeans: {
    names: [
      "Slim Fit Jeans",
      "Regular Denim",
      "Comfort Jeans",
      "Stylish Jeans",
    ],
    descriptions: [
      "Comfortable stretch denim with perfect modern fit",
      "Classic jeans for everyday casual wear",
    ],
    priceRange: [1499, 3999],
    sizes: ["S", "M", "L", "XL"],
    colors: ["Blue", "Black", "Grey"],
  },
};

const createProductsFromImages = async (folderName, categoryName) => {
  try {
    // Get or create category
    let category = await Category.findOne({ name: categoryName });
    if (!category) {
      category = await Category.create({
        name: categoryName,
        slug: categoryName.toLowerCase(),
        description: `Amazing ${categoryName} collection`,
      });
      console.log(`✅ Created category: ${categoryName}`);
    }

    // Get images from Cloudinary folder
    const images = await getImagesFromFolder(folderName);

    if (images.length === 0) {
      console.log(`❌ No images found in folder: ${folderName}`);
      return 0;
    }

    const template = productTemplates[categoryName];
    if (!template) {
      console.log(`❌ No template found for category: ${categoryName}`);
      return 0;
    }

    const products = [];

    // Create products for each image
    for (let i = 0; i < Math.min(images.length, 25); i++) {
      // Limit to 25 products per category
      const basePrice =
        Math.floor(
          Math.random() * (template.priceRange[1] - template.priceRange[0])
        ) + template.priceRange[0];
      const originalPrice = Math.floor(basePrice * 1.3);

      const productData = {
        name: `${template.names[i % template.names.length]} ${i + 1}`,
        description: template.descriptions[i % template.descriptions.length],
        price: basePrice,
        originalPrice: originalPrice,
        images: [images[i]],
        category: category._id,
        sizes: template.sizes,
        colors: [template.colors[i % template.colors.length]],
        inventory: Math.floor(Math.random() * 50) + 10,
        discount: Math.floor(
          ((originalPrice - basePrice) / originalPrice) * 100
        ),
        featured: i < 3, // First 3 products are featured
        trending: i === 0, // First product is trending
        ratings: (3.5 + Math.random() * 1.5).toFixed(1),
      };

      products.push(productData);
    }

    // Insert all products at once
    await Product.insertMany(products);
    console.log(`🎉 Created ${products.length} products for ${categoryName}`);

    return products.length;
  } catch (error) {
    console.error(
      `❌ Error creating products for ${categoryName}:`,
      error.message
    );
    return 0;
  }
};

// Main function
const main = async () => {
  try {
    console.log("🚀 Starting product creation from Cloudinary...\n");

    // Map your Cloudinary folders to categories
    const folderMappings = [
      { folder: "featuredCategory", category: "shirts" },
      { folder: "featuredCategory", category: "tshirts" },
      { folder: "featuredCategory", category: "jeans" },
    ];

    let totalProducts = 0;

    for (const mapping of folderMappings) {
      const count = await createProductsFromImages(
        mapping.folder,
        mapping.category
      );
      totalProducts += count;
    }

    console.log(
      `\n✅ SUCCESS! Created total ${totalProducts} products in database`
    );
    console.log("📊 Your e-commerce store is now ready with products!");

    process.exit(0);
  } catch (error) {
    console.error("❌ Script failed:", error.message);
    process.exit(1);
  }
};

// Run the script
main();
