import React, { createContext, useContext, useEffect } from "react";

type DarkModeContextType = {
  isDark: boolean;
  toggle: () => void;
};

const DarkModeContext = createContext<DarkModeContextType>({
  isDark: false,
  toggle: () => {},
});

export function DarkModeProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    document.documentElement.classList.remove("dark");
    try { localStorage.removeItem("nempo-dark-mode"); } catch {}
  }, []);

  return (
    <DarkModeContext.Provider value={{ isDark: false, toggle: () => {} }}>
      {children}
    </DarkModeContext.Provider>
  );
}

export function useDarkMode() {
  return useContext(DarkModeContext);
}
