import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User";

const JWT_SECRET = process.env.JWT_SECRET || "secret";

// ✅ REGISTER
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, confirmPassword } = req.body;

    if (!email || !password || !confirmPassword) {
      res.status(400).json({ error: "All fields are required." });
      return;
    }

    if (password.length < 6) {
      res.status(400).json({ error: "Password must be at least 6 characters." });
      return;
    }

    if (password !== confirmPassword) {
      res.status(400).json({ error: "Passwords do not match." });
      return;
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ error: "Email is already registered." });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ email, password: hashedPassword });

    const token = jwt.sign({ userId: user._id, isAdmin: user.isAdmin }, JWT_SECRET, {
      expiresIn: "1d",
    });

    res.status(201).json({ token, userId: user._id, isAdmin: user.isAdmin });
  } catch (err) {
    console.error("Register Error:", err);
    res.status(500).json({ error: "Registration failed. Try again later." });
  }
};

// ✅ LOGIN
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ error: "Email and password are required." });
      return;
    }

    const user = await User.findOne({ email });
    if (!user) {
      res.status(400).json({ error: "No account found with this email." });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(400).json({ error: "Incorrect password. Please try again." });
      return;
    }

    const token = jwt.sign({ userId: user._id, isAdmin: user.isAdmin }, JWT_SECRET, {
      expiresIn: "1d",
    });

    res.json({ token, userId: user._id, isAdmin: user.isAdmin });
  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ error: "Login failed. Try again later." });
  }
};
