import { Router } from "express";
import { requireAuth } from "@clerk/express";
import * as commentReplyController from "../controllers/commentReplyController";

const commentReplyRoutes = Router();

commentReplyRoutes.post(
  "/:id",
  requireAuth(),
  commentReplyController.createCommentReply,
);

commentReplyRoutes.delete(
  "/:commentReplyId",
  requireAuth(),
  commentReplyController.deleteCommentReply,
);

export default commentReplyRoutes;
