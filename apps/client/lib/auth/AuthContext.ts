import { createContext, useContext } from "react";
import { type User } from "@shrimp/server/bindings/User";

export type AuthValues = {
  token: string | null;

  user: User | null;

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
