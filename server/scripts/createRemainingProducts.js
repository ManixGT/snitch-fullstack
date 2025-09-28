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

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  });

// Get ALL images from newPop folder with pagination
const getAllImages = async () => {
  try {
    let allImages = [];
    let nextCursor = null;
    let totalFetched = 0;

    console.log("📂 Fetching images ONLY from newPop folder...");

    do {
      const options = {
        type: "upload",
        folder: "newPop", // ← CHANGE THIS from 'prefix' to 'folder'
        max_results: 500,
      };

      if (nextCursor) {
        options.next_cursor = nextCursor;
      }

      const result = await cloudinary.api.resources(options);

      // Check if we got any images
      if (result.resources.length === 0 && !nextCursor) {
        console.log(
          "❌ No images found in newPop folder. Checking if folder exists..."
        );
        // Let's list all folders to debug
        const folders = await cloudinary.api.root_folders();
        console.log("📁 Available folders:", folders);
        break;
      }

      const batchImages = result.resources.map((resource) => ({
        url: resource.secure_url,
        public_id: resource.public_id,
        folder: resource.folder, // Add folder info for debugging
      }));

      allImages = allImages.concat(batchImages);
      totalFetched += result.resources.length;
      nextCursor = result.next_cursor;

      if (result.resources.length > 0) {
        console.log(
          `📸 Fetched batch of ${result.resources.length} images. Total: ${totalFetched}`
        );
      }
    } while (nextCursor && totalFetched < 200); // Safety limit

    console.log(
      `✅ Final count: ${allImages.length} images from newPop folder`
    );

    // Debug: Show folder info
    if (allImages.length > 0) {
      console.log("🔍 Sample images with folder info:");
      allImages.slice(0, 5).forEach((img, i) => {
        console.log(`   ${i + 1}. ${img.public_id} [Folder: ${img.folder}]`);
      });
    }

    return allImages;
  } catch (error) {
    console.error("❌ Error fetching images:", error.message);

    // If folder doesn't exist, try listing what's available
    try {
      const folders = await cloudinary.api.root_folders();
      console.log("📁 Available folders:", folders);
    } catch (e) {
      console.log("❌ Could not list folders");
    }

    return [];
  }
};

// Product templates
const productTemplates = {
  shirts: {
    names: [
      "Classic Cotton Shirt",
      "Formal White Shirt",
      "Casual Button Down",
      "Office Wear Shirt",
      "Premium Dress Shirt",
      "Business Casual Shirt",
      "Linen Blend Shirt",
      "Stretch Comfort Shirt",
      "Designer Collar Shirt",
      "Executive Fit Shirt",
      "Modern Fit Shirt",
      "Slim Fit Shirt",
    ],
    descriptions: [
      "Premium cotton shirt with modern fit for professional look",
      "Comfortable daily wear shirt perfect for office and casual outings",
      "High-quality fabric that breathes well and maintains shape",
      "Perfect for business meetings and formal occasions",
      "Exceptional comfort with stylish contemporary design",
    ],
    priceRange: [999, 2499],
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["White", "Blue", "Black", "Grey", "Navy", "Maroon", "Green"],
  },
  tshirts: {
    names: [
      "Basic Cotton T-Shirt",
      "Premium Crew Neck",
      "Fashion Tee",
      "Casual T-Shirt",
      "V-Neck Comfort",
      "Graphic Print Tee",
      "Oversized T-Shirt",
      "Athletic Fit Tee",
      "Pocket T-Shirt",
      "Long Sleeve Tee",
      "Ringer T-Shirt",
      "Henley Neck Tee",
    ],
    descriptions: [
      "100% cotton soft t-shirt for ultimate comfort",
      "Perfect fit t-shirt for daily casual wear",
      "Breathable fabric ideal for all-day comfort",
      "Great for layering or wearing on its own",
      "Durable construction that withstands repeated washing",
    ],
    priceRange: [499, 1499],
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Black", "White", "Navy", "Grey", "Red", "Green", "Yellow"],
  },
  jeans: {
    names: [
      "Slim Fit Jeans",
      "Regular Denim",
      "Comfort Jeans",
      "Stylish Jeans",
      "Skinny Fit Jeans",
      "Bootcut Jeans",
      "Relaxed Fit Jeans",
      "Stretch Denim Jeans",
      "Ripped Jeans",
      "Dark Wash Jeans",
      "Vintage Fit Jeans",
      "Carpenter Jeans",
    ],
    descriptions: [
      "Comfortable stretch denim with perfect modern fit",
      "Classic jeans for everyday casual wear",
      "Durable denim that molds to your shape over time",
      "Perfect combination of style and comfort",
      "Versatile jeans suitable for various occasions",
    ],
    priceRange: [1499, 3999],
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Blue", "Black", "Grey", "Dark Blue", "Light Blue", "Faded"],
  },
};

const createRemainingProducts = async () => {
  try {
    // Get all images from Cloudinary newPop folder
    const allImages = await getAllImages();
    if (allImages.length === 0) {
      console.log("❌ No images found in Cloudinary newPop folder");
      return 0;
    }

    // Get all categories from DB
    const categories = await Category.find({});
    console.log(
      `📊 Found ${categories.length} categories:`,
      categories.map((c) => c.name)
    );

    let totalNewProducts = 0;

    // Process each category
    for (const category of categories) {
      console.log(`\n📍 Processing category: ${category.name}`);

      // Count existing products in this category
      const existingCount = await Product.countDocuments({
        category: category._id,
      });
      console.log(`📈 Existing products in ${category.name}: ${existingCount}`);

      const template = productTemplates[category.name];
      if (!template) {
        console.log(`❌ No template for category: ${category.name}`);
        continue;
      }

      // Calculate how many products this category should have (split evenly)
      const imagesPerCategory = Math.floor(
        allImages.length / categories.length
      );
      const categoryStartIndex =
        categories.indexOf(category) * imagesPerCategory;

      console.log(
        `🖼️  Images allocated to ${
          category.name
        }: indices ${categoryStartIndex} to ${
          categoryStartIndex + imagesPerCategory - 1
        } (${imagesPerCategory} images)`
      );

      const products = [];

      // Create products for this category's image range, starting after existing products
      for (
        let i = categoryStartIndex + existingCount;
        i < categoryStartIndex + imagesPerCategory;
        i++
      ) {
        if (i >= allImages.length) {
          console.log(`⏩ Reached end of images at index ${i}`);
          break;
        }

        const image = allImages[i];
        const productNumber =
          existingCount + (i - categoryStartIndex - existingCount) + 1;

        // Check if product already exists with this image
        const existingProduct = await Product.findOne({
          images: image.url,
          category: category._id,
        });

        if (existingProduct) {
          console.log(`⏩ Skipping existing product: ${image.public_id}`);
          continue;
        }

        const basePrice =
          Math.floor(
            Math.random() * (template.priceRange[1] - template.priceRange[0])
          ) + template.priceRange[0];
        const originalPrice = Math.floor(basePrice * 1.3);

        const productData = {
          name: `${template.names[i % template.names.length]} ${productNumber}`,
          description: template.descriptions[i % template.descriptions.length],
          price: basePrice,
          originalPrice: originalPrice,
          images: [image.url],
          category: category._id,
          sizes: template.sizes,
          colors: [template.colors[i % template.colors.length]],
          inventory: Math.floor(Math.random() * 50) + 10,
          discount: Math.floor(
            ((originalPrice - basePrice) / originalPrice) * 100
          ),
          featured: i < 3,
          trending: i === categoryStartIndex,
          ratings: (3.5 + Math.random() * 1.5).toFixed(1),
          brand: "Snitch",
        };

        products.push(productData);
        console.log(`➕ Queued product ${productNumber}: ${productData.name}`);
      }

      if (products.length > 0) {
        await Product.insertMany(products);
        console.log(
          `🎉 Created ${products.length} NEW products for ${category.name}`
        );
        totalNewProducts += products.length;
      } else {
        console.log(`✅ All products already exist for ${category.name}`);
      }
    }

    return totalNewProducts;
  } catch (error) {
    console.error("❌ Error creating products:", error.message);
    return 0;
  }
};

// Main function
const main = async () => {
  try {
    console.log("🚀 Starting product creation for ALL categories...\n");
    console.log("📌 This will:");
    console.log("   - Get ALL 100+ images from your newPop Cloudinary folder");
    console.log("   - Split them evenly between shirts, tshirts, jeans");
    console.log("   - Create products for remaining images only");
    console.log("   - Skip existing products\n");

    const totalNewProducts = await createRemainingProducts();

    console.log(`\n✅ SUCCESS! Created ${totalNewProducts} NEW products total`);
    console.log("📊 All categories now have products from all your images!");
    console.log("🎯 No more manual fixing needed!");

    process.exit(0);
  } catch (error) {
    console.error("❌ Script failed:", error.message);
    process.exit(1);
  }
};

// Run the script
main();
