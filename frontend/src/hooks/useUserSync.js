import { useAuth, useUser } from "@clerk/react";
import { useMutation } from "@tanstack/react-query";
import { useEffect } from "react";
import { syncUser } from "../lib/api";
import toast from "react-hot-toast";

const useUserSync = () => {
  const { isSignedIn } = useAuth();
  const { user, isLoaded } = useUser();

  const {
    mutate: syncUserMutation,
    isPending,
    isSuccess,
    isError,
  } = useMutation({
    mutationFn: syncUser,
    onError: (error) => {
      console.error("User sync failed:", error);
      toast.error("User sync failed");
    },
  });

  const name = user?.fullName || user?.firstName;

  useEffect(() => {
    if (!isLoaded) return;
    if (!isSignedIn) return;
    if (!user) return;
    if (!name) return; // prevent sync if no name

    if (!isPending && !isSuccess && !isError) {
      syncUserMutation({
        email: user.primaryEmailAddress?.emailAddress,
        name: name,
        imageUrl: user.imageUrl,
      });
    }
  }, [
    isLoaded,
    isSignedIn,
    user,
    name,
    isPending,
    isSuccess,
    isError,
    syncUserMutation,
  ]);

  return { isSynced: isSuccess };
};

export default useUserSync;
