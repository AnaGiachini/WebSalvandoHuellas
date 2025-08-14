import { useEffect } from "react";

/**
 * ThemeProvider (simple)
 * - Lee el tema del localStorage o usa "light" por defecto.
 * - Aplica/remueve la clase en <html> para compatibilidad con Tailwind (darkMode:"class").
 * - Props soportadas: attribute, defaultTheme, enableSystem, disableTransitionOnChange (ignoradas si no hacen falta).
 */
export default function ThemeProvider({
  children,
  attribute = "class",
  defaultTheme = "light",
  enableSystem = true, // no usado en este stub
  disableTransitionOnChange = true, // no usado en este stub
}) {
  useEffect(() => {
    // Intentar leer el tema guardado; si no, usar defaultTheme
    const saved = typeof window !== "undefined" ? localStorage.getItem("theme") : null;
    const theme = saved || defaultTheme;

    const root = document.documentElement;

    // Para darkMode: 'class' en Tailwind, aplicamos "dark" o limpiamos
    if (attribute === "class") {
      if (theme === "dark") {
        root.classList.add("dark");
      } else {
        root.classList.remove("dark");
      }
    } else {
      // Alternativamente, usar atributo data-theme
      root.setAttribute(attribute, theme);
    }
  }, [attribute, defaultTheme]);

  return children;
}
