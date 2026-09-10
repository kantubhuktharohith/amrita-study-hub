import { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark";

const ThemeContext = createContext<{ theme: Theme; toggle: () => void }>({
  theme: "light",
  toggle: () => {},
});

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme] = useState<Theme>("light");

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("dark");
    try {
      localStorage.setItem("theme", "light");
    } catch {
      // ignore
    }
  }, []);

  const toggle = () => {};

  return (
    <ThemeContext.Provider value={{ theme: "light", toggle }}>
      {children}
    </ThemeContext.Provider>
  );
};
