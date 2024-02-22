import { PropsWithChildren, createContext, useContext } from "react";

const ComposeContext = createContext({
  a: 12,
});

export const useCompose = () => useContext(ComposeContext);

export const ComposeProvider = ({ children }: PropsWithChildren) => {
  return (
    <ComposeContext.Provider value={{ a: 24 }}>
      {children}
    </ComposeContext.Provider>
  );
};
