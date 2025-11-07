import { create } from "zustand";

type Theme = "light" | "dark";

interface ThemeState {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

export const useThemeStore = create<ThemeState>((set) => {
  // Get the theme from localStorage or fallback to prefers-color-scheme if not set
  const storedTheme = localStorage.getItem("theme") as Theme;
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

  // Initialize theme based on localStorage, or fallback to system preference
  const initialTheme: Theme = storedTheme || (prefersDark ? "dark" : "light");

  // Set the initial theme on the document
  if (typeof window !== "undefined") {
    document.documentElement.classList.toggle("dark", initialTheme === "dark");
  }

  return {
    theme: initialTheme,
    toggleTheme: () =>
      set((state) => {
        const newTheme = state.theme === "light" ? "dark" : "light";
        if (typeof window !== "undefined") {
          document.documentElement.classList.toggle(
            "dark",
            newTheme === "dark"
          );
          localStorage.setItem("theme", newTheme);
        }
        return { theme: newTheme };
      }),
    setTheme: (theme) =>
      set(() => {
        if (typeof window !== "undefined") {
          document.documentElement.classList.toggle("dark", theme === "dark");
          localStorage.setItem("theme", theme);
        }
        return { theme };
      }),
  };
});
