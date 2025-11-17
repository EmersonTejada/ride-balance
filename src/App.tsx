import { useEffect } from "react";
import { useThemeStore } from "./stores/useThemeStore";
import { AppRoutes } from "./routes/AppRoutes";

function App() {
  const theme = useThemeStore((state) => state.theme)

  useEffect(() => {
    const root = document.documentElement
    if(theme === "system") {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
      root.classList.toggle("dark", prefersDark)
    } else {
      root.classList.toggle("dark", theme === "dark")
    }
  }, [theme])
  return (
    <>
      <AppRoutes />
    </>
  );
}

export default App;
