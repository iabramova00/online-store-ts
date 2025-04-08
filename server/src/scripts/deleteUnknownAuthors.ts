import mongoose from "mongoose";
import dotenv from "dotenv";
import Book from "../models/Book";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/online-store-ts";

const deleteUnknownAuthors = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("🧹 Connected to MongoDB. Deleting books with 'Unknown Author'...");

    const result = await Book.deleteMany({ author: "Unknown Author" });
    console.log(`✅ Deleted ${result.deletedCount} books with 'Unknown Author'.`);

    await mongoose.disconnect();
    console.log("✅ Disconnected from MongoDB.");
  } catch (err) {
    console.error("❌ Error during deletion:", err);
  }
};

deleteUnknownAuthors();
