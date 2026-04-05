"use client"

import * as React from "react"
import { useTheme } from "next-themes"
import { Palette, Check, ChevronDown } from "lucide-react"
import { themes, themeCategories } from "@/lib/themes"

const categoryLabels = {
  default: "Default",
  dev: "Developer",
  professional: "Professional",
}

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme()
  const [open, setOpen] = React.useState(false)
  const ref = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [])

  const current = themes.find((t) => t.value === theme) ?? themes[0]

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors border border-border bg-background"
        aria-label="Switch theme"
      >
        <Palette className="h-4 w-4" />
        <span className="hidden sm:inline">{current.name}</span>
        <ChevronDown className="h-3 w-3 opacity-60" />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-52 rounded-lg border border-border bg-popover shadow-lg z-50 overflow-hidden">
          {(["default", "dev", "professional"] as const).map((cat) => (
            <div key={cat}>
              <div className="px-3 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                {categoryLabels[cat]}
              </div>
              {themeCategories[cat].map((t) => (
                <button
                  key={t.value}
                  onClick={() => { setTheme(t.value); setOpen(false) }}
                  className="flex w-full items-center justify-between px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground transition-colors"
                >
                  <span>{t.name}</span>
                  {theme === t.value && <Check className="h-3.5 w-3.5" />}
                </button>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
