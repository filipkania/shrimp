import { useRouter } from "next/router";
import { createContext, useContext, useEffect } from "react";

export type AuthValues = {
  token: string | null;

  user: {
    id: number;
    username: string;
  } | null;

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
