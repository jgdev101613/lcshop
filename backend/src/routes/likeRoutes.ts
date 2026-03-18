import { Router } from "express";
import {
  handleLikePost,
  handleUnlikePost,
  handleLikeComment,
  handleUnlikeComment,
  handleLikeReply,
  handleUnlikeReply,
} from "../controllers/likeController";
import { requireAuth } from "@clerk/express";

const likeRouter = Router();

// Post likes
likeRouter.post("/posts/like", requireAuth(), handleLikePost);
likeRouter.post("/posts/unlike", requireAuth(), handleUnlikePost);

// Comment likes
likeRouter.post("/comments/like", requireAuth(), handleLikeComment);
likeRouter.post("/comments/unlike", requireAuth(), handleUnlikeComment);

// Reply likes
likeRouter.post("/replies/like", requireAuth(), handleLikeReply);
likeRouter.post("/replies/unlike", requireAuth(), handleUnlikeReply);

export default likeRouter;
