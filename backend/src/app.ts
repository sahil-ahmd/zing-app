import express from "express";
import "dotenv/config";

import authRoutes from "./routes/authRoute.js";

const app = express();

app.use(express.json()); // (Middleware) parses incoming JSON req bodies and makes them available as re.body in your route handlers.

app.get("/health", (req, res) => {
  res.json({ status: "ok", message: "Server is running" });
});

app.use("/api/auth", authRoutes);

export default app;
