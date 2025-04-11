import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User";
import { IUser } from "../models/User"; 

const JWT_SECRET = process.env.JWT_SECRET || "secret";

export interface AuthRequest extends Request {
  user?: {
    userId: string;
    isAdmin: boolean;
    email: string;
  };
}

export const requireAdmin = (req: AuthRequest, res: Response, next: NextFunction): void => {
  if (!req.user?.isAdmin) {
    res.status(403).json({ error: "Admin access required." });
    return;
  }
  next();
};

export const protect = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ error: "Not authorized. Missing token." });
    return;
  }

  try {
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; isAdmin: boolean };

    // Fetch full user info (without password)
    const user = (await User.findById(decoded.userId).select("email isAdmin")) as IUser;
    if (!user) {
      res.status(401).json({ error: "User not found." });
      return;
    }

    req.user = {
      userId: user._id.toString(),
      isAdmin: user.isAdmin || false,
      email: user.email,
    };

    next();
  } catch (err) {
    console.error("Token verification failed:", err);
    res.status(401).json({ error: "Token is invalid or expired." });
  }
};
