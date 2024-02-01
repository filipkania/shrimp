import type { MeQuery } from "@/types/API";
import { createContext, useContext } from "react";

export type AuthValues = {
  token: string | null;

  user: MeQuery | null;

  logout: () => void;
};

type ContextType = {
  setToken: (_: string) => void;
} & AuthValues;

export const AuthContext = createContext<ContextType>({
  token: null,
  user: null,
  logout: () => null,
  setToken: () => null,
});

export const useAuth = () => useContext(AuthContext);
