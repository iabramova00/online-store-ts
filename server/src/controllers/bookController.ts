import Book from "../models/Book";
import { Request, Response } from "express";

// GET /books
export const getAllBooks = async (_req: Request, res: Response): Promise<void> => {
  try {
    const books = await Book.find();
    res.status(200).json(books);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch books." });
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
export const createBook = async (req: Request, res: Response): Promise<void> => {
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
    !title || !author || !isbn || !publisher || !publicationDate ||
    !format || !numberOfPages || !image || !category || !description ||
    !price || !availabilityStatus
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
export const updateBook = async (req: Request, res: Response): Promise<void> => {
  try {
    const book = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true });
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
export const deleteBook = async (req: Request, res: Response): Promise<void> => {
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
