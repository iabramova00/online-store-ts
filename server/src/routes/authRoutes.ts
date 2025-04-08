import express, { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { register, login } from "../controllers/authController";

const router = express.Router();

// Auth routes
router.post("/register", register);
router.post("/login", login);

// Token verification route
router.get("/verify-token", async (req: Request, res: Response): Promise<void> => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string;
      isAdmin: boolean;
    };

    res.status(200).json({
      userId: decoded.userId,
      isAdmin: decoded.isAdmin,
    });
  } catch (err) {
    res.status(401).json({ error: "Invalid token" });
  }
});

export default router;
