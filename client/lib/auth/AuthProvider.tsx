import { type MeQuery } from "@/types/API";
import { AuthContext, AuthValues } from "./AuthContext";
import { useSetState } from "@mantine/hooks";
import { useLocalStorage } from "@uidotdev/usehooks";
import { useRouter } from "next/router";
import { useEffect, type PropsWithChildren } from "react";
import { type AxiosError } from "axios";
import { API } from "../api";
import { toast } from "sonner";

const AuthProvider = ({ children }: PropsWithChildren) => {
  const router = useRouter();
  const [token, setToken] = useLocalStorage<string | null>("token", null);

  const [contextValues, setContextValues] = useSetState<AuthValues>({
    token,
    user: null,
    logout: () => {
      setContextValues({
        user: null,
        token: null,
      });
      router.push("/auth/login");
    },
  });

  useEffect(() => {
    setToken(contextValues.token);
  }, [contextValues.token, setToken]);

  // biome-ignore lint/correctness/useExhaustiveDependencies:
  useEffect(() => {
    if (!contextValues.token) {
      if (router.pathname !== "/auth/signin") {
        router.push("/auth/signin");
      }
      return;
    }

    (async () => {
      try {
        const res = await API.get("/me", {
          headers: {
            Authorization: `Bearer ${contextValues.token}`,
          },
        });

        setContextValues({
          user: res.data as MeQuery,
        });

        if (router.pathname === "/auth/login") {
          router.push("/");
        }
      } catch (err) {
        if ((err as AxiosError).response?.status === 401) {
          contextValues.logout();
        } else {
          console.error(err);
          toast.error("Error", {
            description: "/api/me not working",
            duration: 5000,
          });
        }
      }
    })();
  }, [contextValues.token]);

  return (
    <AuthContext.Provider value={{ ...contextValues, set: setContextValues }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
