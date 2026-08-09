"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

export type ThemeMode = "light" | "dark" | "special";

interface ThemeContextType {
  theme: ThemeMode;
  resolvedTheme: "light" | "dark" | "special";
  setTheme: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: "light",
  resolvedTheme: "light",
  setTheme: () => {},
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<ThemeMode>("light");
  const [resolvedTheme, setResolvedTheme] = useState<"light" | "dark" | "special">("light");

  useEffect(() => {
    const saved = localStorage.getItem("psip_theme") as ThemeMode | null;
    if (saved && ["light", "dark", "special"].includes(saved)) {
      setThemeState(saved);
    }
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    const activeMode = theme;

    setResolvedTheme(activeMode);
    root.setAttribute("data-theme", activeMode);

    root.classList.remove("light", "dark", "special");
    root.classList.add(activeMode);

    localStorage.setItem("psip_theme", theme);
  }, [theme]);

  const setTheme = (mode: ThemeMode) => {
    setThemeState(mode);
  };

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
