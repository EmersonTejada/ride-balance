import { useEffect } from "react";
import { useThemeStore } from "@/shared/stores/useThemeStore";
import { AppRoutes } from "./routes/AppRoutes";
import { useAuthStore } from "@/features/auth/stores/useAuthStore";

function App() {
  const theme = useThemeStore((state) => state.theme);
  const checkSession = useAuthStore((state) => state.checkSession);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "system") {
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)",
      ).matches;
      root.classList.toggle("dark", prefersDark);
    } else {
      root.classList.toggle("dark", theme === "dark");
    }
  }, [theme]);

  useEffect(() => {
    checkSession();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <>
      <AppRoutes />
    </>
  );
}

export default App;
