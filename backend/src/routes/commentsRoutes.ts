import { Router } from "express";
import { requireAuth } from "@clerk/express";
import * as commentController from "../controllers/commentController";

const commentsRoutes = Router();

commentsRoutes.post("/:id", requireAuth(), commentController.createComment);

commentsRoutes.delete(
  "/:commentId",
  requireAuth(),
  commentController.deleteComment,
);

export default commentsRoutes;
