import express from "express";
import { ENV } from "./config/env";
import fs from "node:fs";
import path from "node:path";
import cors from "cors";
import { clerkMiddleware } from "@clerk/express";
import { Request, Response } from "express";

// Routes
import userRoutes from "./routes/userRoutes";
import commentsRoutes from "./routes/commentsRoutes";
import productRoutes from "./routes/productRoutes";
import commentReplyRoutes from "./routes/commentReplyRoutes";
import likeRouter from "./routes/likeRoutes";

const app = express();

const allowedHost: string[] = [
  "http://localhost:3000",
  "http://192.168.1.101:5173",
  ENV.FRONTEND_URL,
].filter((host): host is string => typeof host === "string");

app.use(cors({ origin: allowedHost, credentials: true }));
// `credentials: true` => allows the frontend to send cookies to the backend for user authentication
app.use(clerkMiddleware());
// Auth Object to be attached to the request
app.use(express.json());
// Parses JSON request bodies
app.use(express.urlencoded({ extended: true }));
// Parses Form Data (like htlm form)

app.get("/api/health", (req: Request, res: Response) => {
  res.json({
    message:
      "Welcome to Lucena Market API - Powered by PostgreSQL, Drizzle ORM & Clerk Auth",
    endpoints: {
      users: "/api/users",
      products: "/api/products",
      comments: "/api/comments",
      commentsReply: "/api/comment-reply",
    },
  });
});

app.use("/api/users", userRoutes);
app.use("/api/comments", commentsRoutes);
app.use("/api/products", productRoutes);
app.use("/api/comment-reply", commentReplyRoutes);
app.use("/api/likes", likeRouter);

const publicDir = path.join(process.cwd(), "public");
if (fs.existsSync(publicDir)) {
  app.use(express.static(publicDir));
  app.get("/{*any}", (req, res, next) => {
    if (req.method !== "GET" && req.method !== "HEAD") {
      next();
      return;
    }

    if (req.path.startsWith("/api") || req.path.startsWith("/webhooks")) {
      next();
      return;
    }

    res.sendFile(path.join(publicDir, "index.html"), (err) => next(err));
  });
}

app.listen(ENV.PORT, () =>
  console.log(`Server is running on port ${ENV.PORT}`),
);
