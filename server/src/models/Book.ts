import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // If you have a user model
    required: true,
  },
  name: String,
  rating: {
    type: Number,
    required: true,
    min: 0,
    max: 5,
  },
  comment: String,
}, {
  timestamps: true,
});

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  isbn: { type: String, required: true, unique: true },
  publisher: { type: String, required: true },
  publicationDate: { type: Date, required: true },
  format: { 
    type: String, 
    enum: ["Hardcover", "Paperback", "eBook"], 
    default: "Paperback", 
    required: true 
  },
  numberOfPages: { type: Number, required: true },
  image: { type: String, required: true }, // image URL
  category: {
    type: String,
    required: true,
    enum: [
      "Fiction",
      "Non-Fiction",
      "Biographies & Memoirs",
      "Children’s & Educational Books",
      "Business, Economics & Self-Help",
      "Science, Technology & Nature",
      "History, Politics & Society",
      "Art, Design & Literature",
      "Religion, Spirituality & Philosophy",
      "Comics, Manga & Graphic Novels"
    ]
  },
  tag: {
    type: String,
    enum: ["Bestseller", "Trending", "New Release", "None"],
    default: "None"
  },  
  description: { type: String, required: true },
  price: { type: Number, required: true },
  availabilityStatus: {
    type: String,
    enum: ["In Stock", "Out of Stock", "Pre-Order"],
    default: "In Stock",
    required: true
  },

  // Optional
  language: String,
  dimensions: {
    height: Number,
    width: Number,
    unit: { type: String, default: "cm" }
  },
  weight: Number,

  // Reviews and stats
  reviews: [reviewSchema],
  averageRating: {
    type: Number,
    default: 0,
  },
  numReviews: {
    type: Number,
    default: 0,
  }
}, {
  timestamps: true
});

const Book = mongoose.model("Book", bookSchema);
export default Book;