import { useAuth } from "@clerk/react";
import { useEffect } from "react";
import api from "../lib/axios";

let isInterceptorRegistered = false;

const useAuthRequest = () => {
  const { isSignedIn, getToken, isLoaded } = useAuth();

  useEffect(() => {
    if (isInterceptorRegistered) return;
    isInterceptorRegistered = true;

    const interceptor = api.interceptors.request.use(async (config) => {
      console.log("🔵 Interceptor running, isSignedIn:", isSignedIn);
      if (isSignedIn) {
        const token = await getToken();
        console.log("🟢 Token:", token ? "exists" : "NULL");
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
      console.log("🔵 Final headers:", config.headers);
      return config;
    });

    return () => {
      api.interceptors.request.eject(interceptor);
      isInterceptorRegistered = false;
    };
  }, [isSignedIn, getToken]);
  return { isSignedIn, isClerkLoaded: isLoaded };
};

export default useAuthRequest;
