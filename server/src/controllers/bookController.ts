import Book from "../models/Book";
import { Request, Response } from "express";

// GET /books
export const getAllBooks = async (_req: Request, res: Response): Promise<void> => {
  const books = await Book.find();
  res.json(books);
};

// GET /books/:id
export const getBook = async (req: Request, res: Response): Promise<void> => {
  const book = await Book.findById(req.params.id);
  if (!book) {
    res.status(404).json({ error: "Book not found" });
    return;
  }
  res.json(book);
};

// POST /books
export const createBook = async (req: Request, res: Response): Promise<void> => {
  const book = new Book(req.body);
  await book.save();
  res.status(201).json(book);
};

// PUT /books/:id
export const updateBook = async (req: Request, res: Response): Promise<void> => {
  const book = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!book) {
    res.status(404).json({ error: "Book not found" });
    return;
  }
  res.json(book);
};

// DELETE /books/:id
export const deleteBook = async (req: Request, res: Response): Promise<void> => {
  const book = await Book.findByIdAndDelete(req.params.id);
  if (!book) {
    res.status(404).json({ error: "Book not found" });
    return;
  }
  res.json({ message: "Book deleted" });
};
