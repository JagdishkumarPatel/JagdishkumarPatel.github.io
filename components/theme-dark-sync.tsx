"use client"

import { useEffect } from "react"
import { useTheme } from "next-themes"

// All themes that should activate Tailwind's dark: utilities
const DARK_THEMES = new Set(["dark", "catppuccin", "gruvbox", "one-dark", "rose-pine", "ocean"])

/**
 * Syncs a `.dark` class onto <html> whenever the active theme is a dark variant.
 * This bridges next-themes' data-theme attribute with Tailwind's darkMode: ["class"].
 */
export function ThemeDarkSync() {
  const { resolvedTheme } = useTheme()

  useEffect(() => {
    const root = document.documentElement
    if (resolvedTheme && DARK_THEMES.has(resolvedTheme)) {
      root.classList.add("dark")
    } else {
      root.classList.remove("dark")
    }
  }, [resolvedTheme])

  return null
}
