import { Router } from "express";
import { protectRoute } from "../middleware/auth.js";
import { authCallback, getMe } from "../controllers/authController.js";

const router = Router();

router.get("/me", protectRoute, getMe);
router.post("/callback", authCallback);  // to send user into mongodb from clerk auth

export default router;