import { Request, Response } from "express";
import { getAuth } from "@clerk/express";
import {
  likePost,
  unlikePost,
  likeComment,
  unlikeComment,
  likeReply,
  unlikeReply,
} from "../db/queries";

export const handleLikePost = async (req: Request, res: Response) => {
  try {
    const { userId } = getAuth(req);
    if (!userId) return res.status(401).json({ error: "User ID required" });
    const { productId } = req.body;
    if (!productId)
      return res.status(400).json({ error: "Product ID required" });

    const like = await likePost(userId, productId);
    res.status(200).json(like || { message: "Already liked" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to like post" });
  }
};

export const handleUnlikePost = async (req: Request, res: Response) => {
  try {
    const { userId } = getAuth(req);
    if (!userId) return res.status(401).json({ error: "User ID required" });

    const { productId } = req.body;
    if (!productId)
      return res.status(400).json({ error: "Product ID required" });

    const deleted = await unlikePost(userId, productId);

    if (!deleted) {
      return res.status(200).json({ message: "Not liked yet" });
    }

    res.status(200).json(deleted);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to unlike post" });
  }
};

export const handleLikeComment = async (req: Request, res: Response) => {
  try {
    const { userId } = getAuth(req);
    if (!userId) return res.status(401).json({ error: "User ID required" });
    const { commentId } = req.body;
    if (!commentId)
      return res.status(400).json({ error: "Comment ID required" });

    const like = await likeComment(userId, commentId);
    res.status(200).json(like || { message: "Already liked" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to like comment" });
  }
};

export const handleUnlikeComment = async (req: Request, res: Response) => {
  try {
    const { userId } = getAuth(req);
    if (!userId) return res.status(401).json({ error: "User ID required" });
    const { commentId } = req.body;
    if (!commentId)
      return res.status(400).json({ error: "Comment ID required" });

    const unlike = await unlikeComment(userId, commentId);
    res.status(200).json(unlike || { message: "Not liked yet" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to unlike comment" });
  }
};

export const handleLikeReply = async (req: Request, res: Response) => {
  try {
    const { userId } = getAuth(req);
    if (!userId) return res.status(401).json({ error: "User ID required" });
    const { replyId } = req.body;
    if (!replyId) return res.status(400).json({ error: "Reply ID required" });

    const like = await likeReply(userId, replyId);
    res.status(200).json(like || { message: "Already liked" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to like reply" });
  }
};

export const handleUnlikeReply = async (req: Request, res: Response) => {
  try {
    const { userId } = getAuth(req);
    if (!userId) return res.status(401).json({ error: "User ID required" });
    const { replyId } = req.body;
    if (!replyId) return res.status(400).json({ error: "Reply ID required" });

    const unlike = await unlikeReply(userId, replyId);
    res.status(200).json(unlike || { message: "Not liked yet" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to unlike reply" });
  }
};
