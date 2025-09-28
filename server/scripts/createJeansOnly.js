import cloudinary from "cloudinary";
import mongoose from "mongoose";
import Product from "../models/Product.js";
import Category from "../models/Category.js";
import { configDotenv } from "dotenv";

configDotenv();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

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
    return result.resources.map((resource) => resource.secure_url);
  } catch (error) {
    console.error(`Error fetching images:`, error.message);
    return [];
  }
};

const createJeansProducts = async () => {
  try {
    // Get or create jeans category
    let category = await Category.findOne({ name: "jeans" });
    if (!category) {
      category = await Category.create({
        name: "jeans",
        slug: "jeans",
        description: "Premium denim jeans collection",
      });
      console.log("✅ Created category: jeans");
    }

    // Get images
    const images = await getImagesFromFolder("featuredCategory");
    console.log(`📸 Found ${images.length} images`);

    // Jeans-specific template with numeric sizes
    const jeansTemplate = {
      names: [
        "Slim Fit Jeans",
        "Skinny Jeans",
        "Regular Fit",
        "Bootcut Jeans",
        "Relaxed Fit",
      ],
      descriptions: [
        "Comfortable stretch denim with perfect modern fit",
        "Classic jeans for everyday casual wear",
        "Premium quality denim with excellent durability",
      ],
      priceRange: [1499, 3999],
      sizes: ["28", "30", "32", "34", "36"], // Now these will work!
      colors: ["Blue", "Black", "Grey", "Dark Blue", "Light Blue"],
    };

    const products = [];

    // Create 10 jeans products
    for (let i = 0; i < Math.min(images.length, 10); i++) {
      const basePrice =
        Math.floor(
          Math.random() *
            (jeansTemplate.priceRange[1] - jeansTemplate.priceRange[0])
        ) + jeansTemplate.priceRange[0];
      const originalPrice = Math.floor(basePrice * 1.3);

      const productData = {
        name: `${jeansTemplate.names[i % jeansTemplate.names.length]} ${i + 1}`,
        description:
          jeansTemplate.descriptions[i % jeansTemplate.descriptions.length],
        price: basePrice,
        originalPrice: originalPrice,
        images: [images[i]],
        category: category._id,
        sizes: jeansTemplate.sizes,
        colors: [jeansTemplate.colors[i % jeansTemplate.colors.length]],
        inventory: Math.floor(Math.random() * 50) + 10,
        discount: Math.floor(
          ((originalPrice - basePrice) / originalPrice) * 100
        ),
        featured: i < 2,
        trending: i === 0,
        ratings: (3.5 + Math.random() * 1.5).toFixed(1),
      };

      products.push(productData);
    }

    await Product.insertMany(products);
    console.log(`🎉 Created ${products.length} jeans products successfully!`);
  } catch (error) {
    console.error("❌ Error creating jeans:", error.message);
  } finally {
    mongoose.connection.close();
  }
};

createJeansProducts();
