import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("creatorflow-theme") || "system";
  });

  useEffect(() => {
    const root = document.documentElement;

    const applyTheme = () => {
      const isDark =
        theme === "dark" ||
        (theme === "system" &&
          window.matchMedia("(prefers-color-scheme: dark)").matches);

      root.classList.toggle("dark", isDark);
    };

    applyTheme();

    localStorage.setItem("creatorflow-theme", theme);

    if (theme === "system") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

      mediaQuery.addEventListener("change", applyTheme);

      return () => {
        mediaQuery.removeEventListener("change", applyTheme);
      };
    }
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme must be used inside ThemeProvider");
  }

  return context;
};
