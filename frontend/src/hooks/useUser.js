import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { updateUserApi, getUserApi } from "../lib/api";

export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateUserApi,

    onSuccess: () => {
      // refresh user related queries
      queryClient.invalidateQueries(["user"]);
      queryClient.invalidateQueries(["profile"]);
    },

    onError: (error) => {
      console.error("Failed to update user:", error);
    },
  });
};

export const useUser = () => {
  return useQuery({
    queryKey: ["user"],
    queryFn: getUserApi,
  });
};
