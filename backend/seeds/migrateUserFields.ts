import mongoose from "mongoose";
import { connectDB } from "@/configs/db"; // Adjust path if necessary
import { User } from "@/models/user.model"; // Adjust path if necessary

async function migrateUserFields() {
  try {
    await connectDB();

    const result = await User.updateMany(
      {
        $or: [
          { isDeleted: { $exists: false } },
          { deletedAt: { $exists: false } },
        ],
      },
      {
        $set: {
          isDeleted: false,
          deletedAt: null,
        },
      }
    );

    console.log("Migration completed!");
    console.log(`Matched: ${result.matchedCount}`);
    console.log(`Modified: ${result.modifiedCount}`);

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error("Migration failed:", error);
    await mongoose.disconnect();
    process.exit(1);
  }
}

migrateUserFields();