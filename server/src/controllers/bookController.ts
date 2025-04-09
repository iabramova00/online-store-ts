import Book from "../models/Book";
import { Request, Response } from "express";
import { SortOrder } from "mongoose";

// GET /books
export const getAllBooks = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const {
      search,
      category,
      tag,
      sort = "popularity",
      page = "1",
      limit = "16",
    } = req.query;

    const query: any = {};

    // 🔍 Search (title or author)
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { author: { $regex: search, $options: "i" } },
      ];
    }

    // 📂 Category filter
    if (category && category !== "All") {
      query.category = category;
    }

    // 🏷️ Tag filter
    if (tag && tag !== "All") {
      query.tag = tag;
    }

    // 🔃 Sorting
    let sortOption: { [key: string]: SortOrder } = {};
    switch (sort) {
      case "price-low-high":
        sortOption = { price: 1 };
        break;
      case "price-high-low":
        sortOption = { price: -1 };
        break;
      case "newest":
        sortOption = { publicationDate: -1 };
        break;
      case "rating":
        sortOption = { averageRating: -1 };
        break;
      default:
        sortOption = { createdAt: -1 };
    }

    // 🔢 Pagination logic
    const pageNumber = parseInt(page as string, 10);
    const limitNumber = Math.min(Math.max(parseInt(limit as string, 10), 1), 100);

    const totalBooks = await Book.countDocuments(query);
    const totalPages = Math.ceil(totalBooks / limitNumber);
    const currentPage = Math.min(pageNumber, totalPages === 0 ? 1 : totalPages);
    const skip = (currentPage - 1) * limitNumber;

    // 📚 Get paginated & sorted books
    const books = await Book.find(query)
      .sort(sortOption)
      .skip(skip)
      .limit(limitNumber);

    // ✅ Respond
    res.status(200).json({
      books,
      total: totalBooks,
      page: currentPage,
      pages: totalPages,
    });
  } catch (err) {
    console.error("Error fetching books:", err);
    res.status(500).json({ error: "Failed to fetch books." });
  }
};

// GET /books/categories
export const getBookCategories = async (
  _req: Request,
  res: Response
): Promise<void> => {
  try {
    const categories = await Book.aggregate([
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
    ]);

    res.status(200).json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ error: "Failed to get categories." });
  }
};

// GET /books/:id
export const getBook = async (req: Request, res: Response): Promise<void> => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      res.status(404).json({ error: "Book not found." });
      return;
    }
    res.status(200).json(book);
  } catch (err) {
    res.status(400).json({ error: "Invalid book ID." });
  }
};

// POST /books
export const createBook = async (
  req: Request,
  res: Response
): Promise<void> => {
  console.log("Creating book with data:", req.body);
  const {
    title,
    author,
    isbn,
    publisher,
    publicationDate,
    format,
    numberOfPages,
    image,
    category,
    description,
    price,
    availabilityStatus,
  } = req.body;

  if (
    !title ||
    !author ||
    !isbn ||
    !publisher ||
    !publicationDate ||
    !format ||
    !numberOfPages ||
    !image ||
    !category ||
    !description ||
    !price ||
    !availabilityStatus
  ) {
    res.status(400).json({ error: "Missing required fields." });
    return;
  }

  const allowedCategories = [
    "Fiction",
    "Non-Fiction",
    "Biographies & Memoirs",
    "Children’s & Educational Books",
    "Business, Economics & Self-Help",
    "Science, Technology & Nature",
    "History, Politics & Society",
    "Art, Design & Literature",
    "Religion, Spirituality & Philosophy",
    "Comics, Manga & Graphic Novels",
  ];

  if (!allowedCategories.includes(category)) {
    res.status(400).json({ error: "Invalid category." });
    return;
  }

  try {
    const book = new Book(req.body);
    await book.save();
    res.status(201).json(book);
  } catch (error: any) {
    console.error("Error saving book:", error.message);
    res.status(500).json({ error: error.message });
  }
};

// PUT /books/:id
export const updateBook = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const book = await Book.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!book) {
      res.status(404).json({ error: "Book not found." });
      return;
    }
    res.status(200).json({ message: "Book updated successfully.", book });
  } catch (err) {
    res.status(400).json({ error: "Invalid book ID or update failed." });
  }
};

// DELETE /books/:id
export const deleteBook = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);
    if (!book) {
      res.status(404).json({ error: "Book not found." });
      return;
    }
    res.status(200).json({ message: "Book deleted successfully." });
  } catch (err) {
    res.status(400).json({ error: "Invalid book ID." });
  }
};
