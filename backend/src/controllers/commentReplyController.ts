import type { Request, Response } from "express";
import * as queries from "../db/queries";
import { getAuth } from "@clerk/express";

export const createCommentReply = async (req: Request, res: Response) => {
  try {
    const { userId } = getAuth(req);
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const { id } = req.params;
    const commentId = Array.isArray(id) ? id[0] : id;
    const { content } = req.body;

    if (!content)
      return res.status(400).json({ error: "Comment content is required" });

    const comment = await queries.getCommentById(commentId);
    if (!comment) return res.status(404).json({ error: "Comment not found" });

    const commentReply = await queries.createCommentReply({
      content,
      userId,
      commentId,
    });

    res.status(201).json(commentReply);
  } catch (error) {
    console.error("Error creating comment reply:", error);
    res.status(500).json({ error: "Failed to create comment reply" });
  }
};

export const deleteCommentReply = async (req: Request, res: Response) => {
  try {
    const { userId } = getAuth(req);
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const { commentReplyId } = req.params;
    const id = Array.isArray(commentReplyId)
      ? commentReplyId[0]
      : commentReplyId;

    const existingCommentReply = await queries.getCommentReplyById(id);
    if (!existingCommentReply)
      return res.status(404).json({ error: "Comment not found" });

    if (existingCommentReply.userId !== userId)
      return res
        .status(403)
        .json({ error: "You can only delete your own comment reply" });

    await queries.deleteComment(id);
    res.status(200).json({ message: "Comment Reply deleted successfully" });
  } catch (error) {
    console.error("Error deleting comment reply:", error);
    res.status(500).json({ error: "Failed to delete comment reply" });
  }
};
