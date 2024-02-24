import { APIError, type MeQuery } from "@/types/API";
import { AuthContext } from "./AuthContext";
import { useLocalStorage } from "@uidotdev/usehooks";
import { useRouter } from "next/router";
import { useEffect, type PropsWithChildren } from "react";
import { API } from "../api.mjs";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { type AxiosError } from "axios";
import { toast } from "sonner";

const AuthProvider = ({ children }: PropsWithChildren) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [token, setToken] = useLocalStorage<string | null>("token", null);

  const { error, status, data } = useQuery({
    queryKey: ["me"],
    queryFn: () => {
      return API.get<MeQuery>("/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    },
    retry: 1,
    refetchInterval: 1000 * 60 * 5, // every 5 minutes
    enabled: !!token,
  });

  useEffect(() => {
    if (!token || status === "error") {
      const err = error as AxiosError<APIError>;

      if (router.pathname !== "/auth/signin") {
        if (err?.response?.status === 401) {
          toast.error("Error", {
            description: "Session has expired. Please log in once again.",
            duration: 5000,
          });
        }

        setToken(null);
        router.push("/auth/signin");
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, status]);

  return (
    <AuthContext.Provider
      value={{
        token,
        user: data?.data || null,
        logout: () => {
          setToken(null);
          queryClient.clear();

          router.push("/auth/signin");
        },
        setToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
