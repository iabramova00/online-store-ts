import express from "express";
import {
  getAllBooks,
  getBook,
  createBook,
  updateBook,
  deleteBook,
} from "../controllers/bookController";
import { protect, requireAdmin } from "../middleware/authMiddleware"; // ✅ Corrected import

const router = express.Router();

// Public routes
router.get("/", getAllBooks);
router.get("/:id", getBook);

// Admin-only routes (requires authentication + admin check)
router.post("/", protect, requireAdmin, createBook);
router.put("/:id", protect, requireAdmin, updateBook);
router.delete("/:id", protect, requireAdmin, deleteBook);

export default router;
