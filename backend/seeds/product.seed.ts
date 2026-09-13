import mongoose from "mongoose";
import dotenv from "dotenv";
import { Product } from "@/models/product.model";

dotenv.config();

const products = [
  // ==================== PHONES ====================

  {
    name: "iPhone 15",
    description:
      "A modern iPhone with a bright display, powerful performance, and an advanced camera system for everyday use.",
    price: 850000,
    stock: 25,
    reservedStock: 0,
    category: "Phones",
    images: [
      "https://res.cloudinary.com/gcheiqcd/image/upload/v1789327705/iphone_17.jpg",
      "https://res.cloudinary.com/gcheiqcd/image/upload/v1789327704/iphone_17_1.jpg",
      "https://res.cloudinary.com/gcheiqcd/image/upload/v1789330184/Phones.jpg",
    ],
    isActive: true,
  },

  {
    name: "iPhone 15 Plus",
    description:
      "A larger iPhone designed for users who want a spacious display, smooth performance, and dependable battery life.",
    price: 950000,
    stock: 18,
    reservedStock: 0,
    category: "Phones",
    images: [
      "https://res.cloudinary.com/gcheiqcd/image/upload/v1789327705/iphone_17.jpg",
      "https://res.cloudinary.com/gcheiqcd/image/upload/v1789327704/iphone_17_1.jpg",
    ],
    isActive: true,
  },

  {
    name: "iPhone 15 Pro",
    description:
      "A premium iPhone built for demanding users, combining powerful performance, a high-quality display, and advanced cameras.",
    price: 1100000,
    stock: 12,
    reservedStock: 0,
    category: "Phones",
    images: [
      "https://res.cloudinary.com/gcheiqcd/image/upload/v1789327704/iphone_17_1.jpg",
      "https://res.cloudinary.com/gcheiqcd/image/upload/v1789330184/Phones.jpg",
    ],
    isActive: true,
  },

  {
    name: "iPhone 15 Pro Max",
    description:
      "A flagship iPhone with a large display, powerful performance, and an advanced camera system for premium everyday use.",
    price: 1250000,
    stock: 10,
    reservedStock: 0,
    category: "Phones",
    images: [
      "https://res.cloudinary.com/gcheiqcd/image/upload/v1789327705/iphone_17.jpg",
      "https://res.cloudinary.com/gcheiqcd/image/upload/v1789330184/Phones.jpg",
    ],
    isActive: true,
  },

  {
    name: "iPhone 14",
    description:
      "A reliable iPhone offering smooth performance, excellent photography, and a bright display for everyday tasks.",
    price: 700000,
    stock: 22,
    reservedStock: 0,
    category: "Phones",
    images: [
      "https://res.cloudinary.com/gcheiqcd/image/upload/v1789330184/Phones.jpg",
      "https://res.cloudinary.com/gcheiqcd/image/upload/v1789327705/iphone_17.jpg",
    ],
    isActive: true,
  },

  {
    name: "iPhone 14 Pro",
    description:
      "A premium iPhone featuring powerful performance, a high-quality display, and capable cameras for photography and video.",
    price: 900000,
    stock: 14,
    reservedStock: 0,
    category: "Phones",
    images: [
      "https://res.cloudinary.com/gcheiqcd/image/upload/v1789327705/iphone_17.jpg",
      "https://res.cloudinary.com/gcheiqcd/image/upload/v1789327704/iphone_17_1.jpg",
    ],
    isActive: true,
  },

  // ==================== LAPTOPS ====================

  {
    name: "MacBook Air M3",
    description:
      "A lightweight MacBook powered by Apple's M3 chip, offering fast performance and excellent battery life for everyday work.",
    price: 1450000,
    stock: 10,
    reservedStock: 0,
    category: "Laptops",
    images: [
      "https://res.cloudinary.com/gcheiqcd/image/upload/v1789326216/MacBook_Air.jpg",
      "https://res.cloudinary.com/gcheiqcd/image/upload/v1789326215/MacBook_Air_1.jpg",
      "https://res.cloudinary.com/gcheiqcd/image/upload/v1789326215/MacBookAir_2.jpg",
    ],
    isActive: true,
  },

  {
    name: "MacBook Air M2",
    description:
      "A slim and portable MacBook designed for productivity, study, browsing, and everyday creative work.",
    price: 1200000,
    stock: 14,
    reservedStock: 0,
    category: "Laptops",
    images: [
      "https://res.cloudinary.com/gcheiqcd/image/upload/v1789326215/MacBook_Air_1.jpg",
      "https://res.cloudinary.com/gcheiqcd/image/upload/v1789326216/MacBook_Air.jpg",
    ],
    isActive: true,
  },

  {
    name: "MacBook Pro 14",
    description:
      "A powerful MacBook designed for developers, creators, and professionals who need strong performance for demanding workloads.",
    price: 1900000,
    stock: 8,
    reservedStock: 0,
    category: "Laptops",
    images: [
      "https://res.cloudinary.com/gcheiqcd/image/upload/v1789326216/MacBook_Air.jpg",
      "https://res.cloudinary.com/gcheiqcd/image/upload/v1789326215/MacBookAir_2.jpg",
    ],
    isActive: true,
  },

  {
    name: "MacBook Pro 16",
    description:
      "A large professional MacBook offering powerful performance and a spacious display for demanding work and creative tasks.",
    price: 2400000,
    stock: 6,
    reservedStock: 0,
    category: "Laptops",
    images: [
      "https://res.cloudinary.com/gcheiqcd/image/upload/v1789326215/MacBook_Air_1.jpg",
      "https://res.cloudinary.com/gcheiqcd/image/upload/v1789326216/MacBook_Air.jpg",
    ],
    isActive: true,
  },

  {
    name: "MacBook Air 13",
    description:
      "A compact MacBook with a slim design, responsive performance, and excellent portability for work and study.",
    price: 1050000,
    stock: 16,
    reservedStock: 0,
    category: "Laptops",
    images: [
      "https://res.cloudinary.com/gcheiqcd/image/upload/v1789326215/MacBookAir_2.jpg",
      "https://res.cloudinary.com/gcheiqcd/image/upload/v1789326216/MacBook_Air.jpg",
    ],
    isActive: true,
  },

  {
    name: "MacBook Air 15",
    description:
      "A larger MacBook Air combining a spacious display with lightweight portability and smooth everyday performance.",
    price: 1350000,
    stock: 11,
    reservedStock: 0,
    category: "Laptops",
    images: [
      "https://res.cloudinary.com/gcheiqcd/image/upload/v1789326216/MacBook_Air.jpg",
      "https://res.cloudinary.com/gcheiqcd/image/upload/v1789326215/MacBook_Air_1.jpg",
    ],
    isActive: true,
  },

  // ==================== FASHION ====================

  {
    name: "Classic Black Hoodie",
    description:
      "A comfortable black hoodie with a clean everyday design, perfect for casual wear and relaxed outings.",
    price: 45000,
    stock: 35,
    reservedStock: 0,
    category: "Fashion",
    images: [
      "https://res.cloudinary.com/gcheiqcd/image/upload/v1789328431/Fashion_4.jpg",
      "https://res.cloudinary.com/gcheiqcd/image/upload/v1789328316/Fashion_3.webp",
      "https://res.cloudinary.com/gcheiqcd/image/upload/v1789328088/Fashion_1.webp",
    ],
    isActive: true,
  },

  {
    name: "Premium Black Hoodie",
    description:
      "A premium casual hoodie featuring a simple design and comfortable fit for everyday styling.",
    price: 55000,
    stock: 28,
    reservedStock: 0,
    category: "Fashion",
    images: [
      "https://res.cloudinary.com/gcheiqcd/image/upload/v1789328088/Fashion_1.webp",
      "https://res.cloudinary.com/gcheiqcd/image/upload/v1789328431/Fashion_4.jpg",
    ],
    isActive: true,
  },

  {
    name: "Oversized Black Hoodie",
    description:
      "A relaxed oversized hoodie designed for a comfortable streetwear-inspired look.",
    price: 50000,
    stock: 22,
    reservedStock: 0,
    category: "Fashion",
    images: [
      "https://res.cloudinary.com/gcheiqcd/image/upload/v1789328316/Fashion_3.webp",
      "https://res.cloudinary.com/gcheiqcd/image/upload/v1789328088/Fashion_1.webp",
    ],
    isActive: true,
  },

  {
    name: "Essential Black Hoodie",
    description:
      "A versatile everyday hoodie with a minimal design that works well with casual outfits.",
    price: 42000,
    stock: 40,
    reservedStock: 0,
    category: "Fashion",
    images: [
      "https://res.cloudinary.com/gcheiqcd/image/upload/v1789328431/Fashion_4.jpg",
      "https://res.cloudinary.com/gcheiqcd/image/upload/v1789328088/Fashion_1.webp",
    ],
    isActive: true,
  },

  {
    name: "Urban Black Hoodie",
    description:
      "A modern casual hoodie inspired by clean urban streetwear styling.",
    price: 48000,
    stock: 25,
    reservedStock: 0,
    category: "Fashion",
    images: [
      "https://res.cloudinary.com/gcheiqcd/image/upload/v1789328316/Fashion_3.webp",
      "https://res.cloudinary.com/gcheiqcd/image/upload/v1789328431/Fashion_4.jpg",
    ],
    isActive: true,
  },

  {
    name: "Everyday Black Hoodie",
    description:
      "A simple and comfortable hoodie made for everyday casual wear and easy outfit combinations.",
    price: 40000,
    stock: 32,
    reservedStock: 0,
    category: "Fashion",
    images: [
      "https://res.cloudinary.com/gcheiqcd/image/upload/v1789328088/Fashion_1.webp",
      "https://res.cloudinary.com/gcheiqcd/image/upload/v1789328316/Fashion_3.webp",
    ],
    isActive: true,
  },

  // ==================== GAMING ====================

  {
    name: "Wireless Gaming Headset",
    description:
      "A wireless gaming headset designed to provide immersive audio and comfortable extended gaming sessions.",
    price: 85000,
    stock: 20,
    reservedStock: 0,
    category: "Gaming",
    images: [
      "https://res.cloudinary.com/gcheiqcd/image/upload/v1789328712/Gaming_1.jpg",
      "https://res.cloudinary.com/gcheiqcd/image/upload/v1789328708/Gaming_2.webp",
      "https://res.cloudinary.com/gcheiqcd/image/upload/v1789328705/Gaming_3.jpg",
    ],
    isActive: true,
  },

  {
    name: "Pro Gaming Headset",
    description:
      "A performance-focused gaming headset with clear audio designed for competitive and immersive gameplay.",
    price: 120000,
    stock: 15,
    reservedStock: 0,
    category: "Gaming",
    images: [
      "https://res.cloudinary.com/gcheiqcd/image/upload/v1789328708/Gaming_2.webp",
      "https://res.cloudinary.com/gcheiqcd/image/upload/v1789328712/Gaming_1.jpg",
    ],
    isActive: true,
  },

  {
    name: "RGB Gaming Headset",
    description:
      "A stylish gaming headset featuring RGB lighting and immersive sound for an enhanced gaming setup.",
    price: 95000,
    stock: 18,
    reservedStock: 0,
    category: "Gaming",
    images: [
      "https://res.cloudinary.com/gcheiqcd/image/upload/v1789328705/Gaming_3.jpg",
      "https://res.cloudinary.com/gcheiqcd/image/upload/v1789328708/Gaming_2.webp",
    ],
    isActive: true,
  },

  {
    name: "Elite Gaming Headset",
    description:
      "A premium headset built for gamers who want detailed audio and comfortable long gaming sessions.",
    price: 150000,
    stock: 10,
    reservedStock: 0,
    category: "Gaming",
    images: [
      "https://res.cloudinary.com/gcheiqcd/image/upload/v1789328712/Gaming_1.jpg",
      "https://res.cloudinary.com/gcheiqcd/image/upload/v1789328705/Gaming_3.jpg",
    ],
    isActive: true,
  },

  {
    name: "Gaming Headset Pro X",
    description:
      "A versatile gaming headset delivering immersive audio for gaming, movies, and everyday entertainment.",
    price: 110000,
    stock: 13,
    reservedStock: 0,
    category: "Gaming",
    images: [
      "https://res.cloudinary.com/gcheiqcd/image/upload/v1789328708/Gaming_2.webp",
      "https://res.cloudinary.com/gcheiqcd/image/upload/v1789328712/Gaming_1.jpg",
    ],
    isActive: true,
  },

  {
    name: "Ultimate Gaming Headset",
    description:
      "A comfortable gaming headset designed to deliver rich sound and an engaging gaming experience.",
    price: 135000,
    stock: 12,
    reservedStock: 0,
    category: "Gaming",
    images: [
      "https://res.cloudinary.com/gcheiqcd/image/upload/v1789328705/Gaming_3.jpg",
      "https://res.cloudinary.com/gcheiqcd/image/upload/v1789328712/Gaming_1.jpg",
    ],
    isActive: true,
  },

  // ==================== HOME ====================

  {
    name: "Modern Desk Lamp",
    description:
      "A modern desk lamp providing focused lighting for workspaces, study areas, and bedside tables.",
    price: 35000,
    stock: 25,
    reservedStock: 0,
    category: "Home",
    images: [
      "https://res.cloudinary.com/gcheiqcd/image/upload/v1789328911/Home_1.jpg",
      "https://res.cloudinary.com/gcheiqcd/image/upload/v1789328907/Home_2.jpg",
      "https://res.cloudinary.com/gcheiqcd/image/upload/v1789328903/Home_3.jpg",
    ],
    isActive: true,
  },

  {
    name: "Minimalist Table Lamp",
    description:
      "A minimalist table lamp designed to add practical lighting and a clean look to any room.",
    price: 42000,
    stock: 20,
    reservedStock: 0,
    category: "Home",
    images: [
      "https://res.cloudinary.com/gcheiqcd/image/upload/v1789328907/Home_2.jpg",
      "https://res.cloudinary.com/gcheiqcd/image/upload/v1789328911/Home_1.jpg",
    ],
    isActive: true,
  },

  {
    name: "LED Desk Lamp",
    description:
      "A compact LED desk lamp suitable for studying, reading, working, and nighttime use.",
    price: 30000,
    stock: 35,
    reservedStock: 0,
    category: "Home",
    images: [
      "https://res.cloudinary.com/gcheiqcd/image/upload/v1789328903/Home_3.jpg",
      "https://res.cloudinary.com/gcheiqcd/image/upload/v1789328907/Home_2.jpg",
    ],
    isActive: true,
  },

  {
    name: "Premium Desk Lamp",
    description:
      "A stylish desk lamp designed to provide comfortable illumination while complementing modern interiors.",
    price: 55000,
    stock: 15,
    reservedStock: 0,
    category: "Home",
    images: [
      "https://res.cloudinary.com/gcheiqcd/image/upload/v1789328911/Home_1.jpg",
      "https://res.cloudinary.com/gcheiqcd/image/upload/v1789328903/Home_3.jpg",
    ],
    isActive: true,
  },

  {
    name: "Adjustable Table Lamp",
    description:
      "A practical adjustable lamp that lets you direct light where you need it for work or study.",
    price: 38000,
    stock: 22,
    reservedStock: 0,
    category: "Home",
    images: [
      "https://res.cloudinary.com/gcheiqcd/image/upload/v1789328907/Home_2.jpg",
      "https://res.cloudinary.com/gcheiqcd/image/upload/v1789328911/Home_1.jpg",
    ],
    isActive: true,
  },

  {
    name: "Smart LED Lamp",
    description:
      "A modern LED lamp designed to provide flexible lighting for bedrooms, desks, and living spaces.",
    price: 60000,
    stock: 14,
    reservedStock: 0,
    category: "Home",
    images: [
      "https://res.cloudinary.com/gcheiqcd/image/upload/v1789328903/Home_3.jpg",
      "https://res.cloudinary.com/gcheiqcd/image/upload/v1789328911/Home_1.jpg",
    ],
    isActive: true,
  },
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI as string);

    console.log("✅ Connected to MongoDB");

    await Product.deleteMany({});
    console.log("🧨 Old products deleted");

    await Product.insertMany(products);

    console.log(`🔥 ${products.length} products inserted successfully`);

    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding error:", error);
    process.exit(1);
  }
};

seedDB();