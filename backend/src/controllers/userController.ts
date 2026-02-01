import type { Response, NextFunction } from "express";
import type { AuthRequest } from "../middleware/auth.js";
import { User } from "../models/User.js";

export async function getUsers(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const currentUserId = req.userId;

    if (!currentUserId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const users = await User.find({ _id: { $ne: currentUserId } })
      .select("name email avatar")
      .limit(50);

    res.status(200).json(users);
  } catch (error) {
    res.status(500);
    next(error);
  }
}
