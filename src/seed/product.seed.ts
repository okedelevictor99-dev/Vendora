import mongoose from "mongoose";
import { faker } from "@faker-js/faker";
import { Product } from "../models/product.model";
import dotenv from "dotenv"

dotenv.config()


const categories = ["Phones", "Laptops", "Fashion", "Gaming", "Home"];

const getCategory = () =>
  categories[Math.floor(Math.random() * categories.length)];

const generateProducts = (count: number) => {
  return Array.from({ length: count }).map(() => {
    const id = faker.string.uuid();

    return {
      name: faker.commerce.productName(),
      description: faker.commerce.productDescription(),
      price: parseFloat(faker.commerce.price({ min: 5000, max: 250000 })),
      stock: faker.number.int({ min: 0, max: 100 }),
      category: getCategory(),

      images: [
        `https://picsum.photos/seed/${id}-1/600/600`,
        `https://picsum.photos/seed/${id}-2/600/600`,
        `https://picsum.photos/seed/${id}-3/600/600`,
      ],

      isActive: true,
    };
  });
};

const seedDB = async () => {
  try {
    // 1. Connect DB
    await mongoose.connect(process.env.MONGO_URI as string);
    console.log("✅ Connected to MongoDB");

    // 2. DELETE old products
    await Product.deleteMany({});
    console.log("🧨 Old products deleted");

    // 3. Generate new products
    const products = generateProducts(50);

    // 4. Insert new products
    await Product.insertMany(products);
    console.log("🔥 50 products inserted successfully");

    process.exit();
  } catch (error) {
    console.error("❌ Seeding error:", error);
    process.exit(1);
  }
};

seedDB();