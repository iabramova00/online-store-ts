import express from "express";
import { protect } from "../middleware/authMiddleware";

const router = express.Router();

router.get("/profile", protect, (req, res) => {
  res.json({ message: "Welcome to your profile!" });
});

export default router;
