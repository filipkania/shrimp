import { AuthContext, AuthValues } from "./AuthContext";
import { useSetState } from "@mantine/hooks";
import { useLocalStorage } from "usehooks-ts";
import { useRouter } from "next/router";
import { useEffect, type PropsWithChildren } from "react";
import { API } from "../api";
import { MeQuery } from "@/types/API";
import { AxiosError } from "axios";
import { toast } from "@/components/ui/use-toast";

const AuthProvider = ({ children }: PropsWithChildren) => {
  const router = useRouter();
  const [token, setToken] = useLocalStorage<string | null>("ShrimpToken", null);

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

  useEffect(() => {
    if (!contextValues.token) {
      if (router.pathname !== "/auth/login") {
        router.push("/auth/login");
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
          toast({
            title: "/api/me not working",
            variant: "destructive",
          });
        }
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contextValues.token]);

  return (
    <AuthContext.Provider value={{ ...contextValues, set: setContextValues }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
