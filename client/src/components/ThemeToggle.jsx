import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function ThemeToggle() {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <button
      onClick={toggleTheme}
      className="px-4 py-2 flex items-center gap-2 rounded-lg border dark:border-gray-700 
                 shadow bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 
                 transition-all duration-200"
    >
      <AnimatePresence mode="wait" initial={false}>
        {theme === "light" ? (
          <motion.span
            key="dark"
            initial={{ opacity: 0, y: -10, rotate: -45 }}
            animate={{ opacity: 1, y: 0, rotate: 0 }}
            exit={{ opacity: 0, y: 10, rotate: 45 }}
            transition={{ duration: 0.2 }}
            className="text-lg"
          >
            🌙
          </motion.span>
        ) : (
          <motion.span
            key="light"
            initial={{ opacity: 0, y: -10, rotate: 45 }}
            animate={{ opacity: 1, y: 0, rotate: 0 }}
            exit={{ opacity: 0, y: 10, rotate: -45 }}
            transition={{ duration: 0.2 }}
            className="text-lg"
          >
            ☀️
          </motion.span>
        )}
      </AnimatePresence>

      <span className="text-sm font-medium">
        {theme === "light" ? "Dark Mode" : "Light Mode"}
      </span>
    </button>
  );
}
