import express from "express";
import {
  getAllBooks,
  getBookCategories,
  getBook,
  createBook,
  updateBook,
  deleteBook,
  createBookReview,
  deleteBookReview
} from "../controllers/bookController";
import { protect, requireAdmin } from "../middleware/authMiddleware";

const router = express.Router();

// Public routes
router.get("/", getAllBooks);
router.get("/categories", getBookCategories);
router.get("/:id", getBook);

// 🔐 Review routes (logged-in users only)
router.post("/:id/reviews", protect, createBookReview);
router.delete("/:id/reviews", protect, deleteBookReview);

// 🔐 Admin-only routes
router.post("/", protect, requireAdmin, createBook);
router.put("/:id", protect, requireAdmin, updateBook);
router.delete("/:id", protect, requireAdmin, deleteBook);

export default router;
