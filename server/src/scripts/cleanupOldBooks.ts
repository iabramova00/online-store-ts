import mongoose from "mongoose";
import dotenv from "dotenv";
import Book from "../models/Book"; // adjust path if needed

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/online-store-ts";

const cleanupOldBooks = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected to MongoDB");

    const cutoffDate = new Date("2015-01-01");

    const deleteResult = await Book.deleteMany({
      publicationDate: { $lt: cutoffDate },
    });

    console.log(`🧹 Deleted ${deleteResult.deletedCount} books published before 2015.`);

    await mongoose.disconnect();
    console.log("✅ Disconnected from MongoDB");
  } catch (err) {
    console.error("❌ Cleanup failed:", err);
  }
};

cleanupOldBooks();
