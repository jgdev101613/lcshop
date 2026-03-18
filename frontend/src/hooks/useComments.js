import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createComment,
  deleteComment,
  createCommentReply,
  deleteCommentReply,
} from "../lib/api";

export const useCreateComment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createComment,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["product", variables.productId],
      });
    },
  });
};

export const useDeleteComment = (productId) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (commentId) => deleteComment(commentId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["product", productId],
      });
    },
    onError: (error) => console.log(error),
  });
};

export const useCreateCommentReply = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createCommentReply,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["product", variables.productId], // 👈 needs productId in variables
      });
    },
  });
};

export const useDeleteCommentReply = () => {
  const queryClient = useQueryClient(); // 👈 add queryClient
  return useMutation({
    mutationFn: deleteCommentReply,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["product", variables.productId], // 👈 invalidate on success
      });
    },
    onError: (error) => console.log(error),
  });
};
