"use client";

import { createContext, useContext, useState } from "react";

interface AppContextProps {
  NavOpen: boolean;
  setNavOpen: (open: boolean) => void;
}

const AppContext = createContext<AppContextProps | null>(null);

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [NavOpen, setNavOpen] = useState(false);

  return (
    <AppContext.Provider value={{ NavOpen, setNavOpen }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider");
  }

  return context;
};
