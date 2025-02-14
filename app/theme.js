"use client"; // Wajib karena kita menggunakan state di sisi klien

import { createContext, useContext, useState, useEffect } from "react";
import localFont from "next/font/local";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const ThemeContext = createContext();
const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

const queryClient = new QueryClient()

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Toggle mode
  const toggleDarkMode = () => {
    setIsDarkMode((prev) => !prev);
  };

  // Sinkronisasi dengan class "dark" di HTML
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeContext.Provider value={{ isDarkMode, toggleDarkMode }}>
                <body
            className={`${geistSans.variable} ${geistMono.variable} ${
              isDarkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"
            } antialiased`}
          >
        {children}
        </body>
      </ThemeContext.Provider>
    </QueryClientProvider>
  );
};

export const useTheme = () => useContext(ThemeContext);
