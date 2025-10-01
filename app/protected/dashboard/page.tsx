"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function DashboardPage() {
  const [isDark, setIsDark] = useState(false);

  // On first load, check system preference or saved mode
  useEffect(() => {
    if (localStorage.getItem("theme") === "dark") {
      document.documentElement.classList.add("dark");
      setIsDark(true);
    } else {
      document.documentElement.classList.remove("dark");
      setIsDark(false);
    }
  }, []);

  // Toggle handler
  const toggleTheme = () => {
    if (document.documentElement.classList.contains("dark")) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
      setIsDark(false);
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
      setIsDark(true);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-6 bg-[var(--color-background)] text-[var(--color-text)] transition-colors">
      <h1 className="text-2xl font-bold">Dashboard Page</h1>

      <Link
        href="/login"
        className="px-4 py-2 bg-[var(--color-button-primary)] text-white rounded-lg shadow hover:bg-[var(--color-button-primary-hover)]"
      >
        Back to Login
      </Link>

      <button
        onClick={toggleTheme}
        className="px-4 py-2 rounded-lg shadow bg-[var(--color-button-secondary)] text-white hover:bg-[var(--color-button-secondary-hover)] transition"
      >
        {isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
      </button>
    </div>
  );
}
