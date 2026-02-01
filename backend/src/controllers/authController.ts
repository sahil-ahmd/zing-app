import type { Response, Request, NextFunction } from "express";
import { clerkClient, getAuth } from "@clerk/express";
import type { AuthRequest } from "../middleware/auth.js";
import { User } from "../models/User.js";

export async function getMe(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const userId = req.userId;
    const user = await User.findById(userId);

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500);
    next(error);
  }
}

export async function authCallback(req: Request, res: Response, next: NextFunction) {
  try {
    const { userId: clerkId } = getAuth(req);

    if (!clerkId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    let user = await User.findOne({ clerkId });

    if (!user) {
      // Get user info from clerk and save it to mongoDB
      const clerkUser = await clerkClient.users.getUser(clerkId);

      user = await User.create({
        clerkId,
        name: (clerkUser.firstName
          ? `${clerkUser.firstName} ${clerkUser.lastName || ""}`.trim()
          : clerkUser.emailAddresses[0]?.emailAddress?.split("@")[0]) || "Anonymous User", // Fallback string
        email: clerkUser.emailAddresses[0]?.emailAddress || "", // Fallback string
        avatar: clerkUser.imageUrl || "" // Fallback string
      });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500);
    next(error);
  }
}
