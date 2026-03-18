import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  likePostApi,
  unlikePostApi,
  likeCommentApi,
  unlikeCommentApi,
  likeReplyApi,
  unlikeReplyApi,
} from "../lib/api";

/**
 * useLikes hook
 * Handles likes/unlikes for posts, comments, and replies.
 * Automatically invalidates the product query so UI updates.
 */
export const useLikes = () => {
  const queryClient = useQueryClient();

  // Generic like mutation
  const like = useMutation({
    mutationFn: async ({ type, id }) => {
      if (type === "post") return likePostApi(id);
      if (type === "comment") return likeCommentApi(id);
      if (type === "reply") return likeReplyApi(id);
      throw new Error("Invalid like type");
    },
    onSuccess: (_, { type, parentProductId, id }) => {
      // Always invalidate the product query that contains this item
      if (type === "post") {
        queryClient.invalidateQueries(["products"]);
        if (parentProductId)
          queryClient.invalidateQueries(["product", parentProductId]);
      } else if (parentProductId) {
        queryClient.invalidateQueries(["product", parentProductId]);
      } else {
        queryClient.invalidateQueries(["product", id]);
      }
    },
    onError: (err) => console.error("Failed to like:", err),
  });

  // Generic unlike mutation
  const unlike = useMutation({
    mutationFn: async ({
      type,
      id,
      parentProductId,
      parentCommentId,
      parentReplyId,
    }) => {
      if (type === "post") return unlikePostApi(parentProductId);
      if (type === "comment") return unlikeCommentApi(parentCommentId);
      if (type === "reply") return unlikeReplyApi(parentReplyId);
      throw new Error("Invalid unlike type");
    },
    onSuccess: (_, { type, parentProductId, id }) => {
      // Always invalidate the product query that contains this item
      if (type === "post") {
        queryClient.invalidateQueries(["products"]);
        if (parentProductId)
          queryClient.invalidateQueries(["product", parentProductId]);
      } else if (parentProductId) {
        queryClient.invalidateQueries(["product", parentProductId]);
      } else {
        queryClient.invalidateQueries(["product", id]);
      }
    },
    onError: (err) => console.error("Failed to unlike:", err),
  });

  return { like, unlike };
};
