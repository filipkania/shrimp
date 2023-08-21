import { AuthContext, AuthValues } from "./AuthContext";
import { useLocalStorage, useSetState } from "@mantine/hooks";
import { useRouter } from "next/router";
import { useEffect, type PropsWithChildren, useLayoutEffect } from "react";
import { queryAPI } from "../useAPI";
import type { MeQuery } from "@/types/API";

const AuthProvider = ({ children }: PropsWithChildren) => {
  const router = useRouter();
  const [token, setToken] = useLocalStorage<string | null>({
    key: "api-token",
    defaultValue: null,
  });

  const [contextValues, setContextValues] = useSetState<AuthValues>({
    token,
    user: null,
    logout: () => {
      if (!contextValues.user && !contextValues.token) return;

      router.push("/auth/login");
      setContextValues({
        user: null,
        token: null,
      });
    },
  });

  useEffect(() => {
    setToken(contextValues.token);
  }, [contextValues.token, setToken]);

  useLayoutEffect(() => {
    if (!contextValues.token) {
      if (router.pathname !== "/auth/login") {
        router.push("/auth/login");
      }
      return;
    }

    queryAPI<MeQuery>("/api/me").then((data) => {
      setContextValues({
        user: data,
      });
    }).catch(() => {
      contextValues.logout();
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contextValues.token]);

  return (
    <AuthContext.Provider value={{ ...contextValues, set: setContextValues }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
