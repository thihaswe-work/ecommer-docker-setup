import { useEffect } from "react";
import { Toaster } from "sonner";
import App from "./App";
import { ErrorProvider } from "./context/errorContext";
import { useThemeStore } from "./store/themeStore";

const Wrapper = () => {
  const setTheme = useThemeStore((state) => state.setTheme);

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme") as
      | "light"
      | "dark"
      | null;
    if (storedTheme) {
      setTheme(storedTheme);
    }
  }, [setTheme]);
  return (
    <>
      <ErrorProvider>
        <App />
        <Toaster />
      </ErrorProvider>
    </>
  );
};

export default Wrapper;
