import { MeQuery } from "@/types/API";
import { createContext, useContext } from "react";

export type AuthValues = {
  token: string | null;

  user: MeQuery | null;

  logout: () => void;
};

type ContextType = {
  set: (
    _: Partial<AuthValues> | ((_: AuthValues) => Partial<AuthValues>)
  ) => void;
} & AuthValues;

export const AuthContext = createContext<ContextType>({
  token: null,
  user: null,
  logout: () => null,
  set: () => null,
});

export const useAuth = () => useContext(AuthContext);
