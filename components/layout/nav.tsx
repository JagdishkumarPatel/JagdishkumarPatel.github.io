"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X } from "lucide-react"
import { ThemeSwitcher } from "@/components/theme-switcher"

const STORAGE_KEY = "portfolio-view"

const navLinks = [
  { label: "About", href: "/about" },
  { label: "Projects", href: "/projects" },
  { label: "Certifications", href: "/certifications" },
  { label: "Education", href: "/education" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
]

export function Nav() {
  const [open, setOpen] = React.useState(false)
  const [scrolled, setScrolled] = React.useState(false)
  const [neuralView, setNeuralView] = React.useState(false)
  const pathname = usePathname()
  const isHome = pathname === "/"

  React.useEffect(() => {
    setNeuralView(localStorage.getItem(STORAGE_KEY) !== "classic")
  }, [])

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-background/80 backdrop-blur-md border-b border-border shadow-sm"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto max-w-6xl px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="font-mono font-bold text-lg text-foreground hover:text-primary transition-colors"
        >
          <span className="text-primary">{">"}</span> Jag Patel
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-3">
          <ThemeSwitcher />
          {isHome && (
            <button
              className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary border border-border bg-background/80 backdrop-blur-sm rounded-full px-2 py-1.5 md:px-3 transition-colors"
              title={neuralView ? "Switch to Classic View" : "Switch to Neural View"}
              aria-label={neuralView ? "Switch to Classic View" : "Switch to Neural View"}
              onClick={() => {
                const next = !neuralView
                setNeuralView(next)
                if (next) {
                  localStorage.removeItem(STORAGE_KEY)
                } else {
                  localStorage.setItem(STORAGE_KEY, "classic")
                }
                window.location.reload()
              }}
            >
              <span>{neuralView ? "⚡" : "🧠"}</span>
              <span className="hidden md:inline whitespace-nowrap">{neuralView ? "Classic View" : "Neural View"}</span>
            </button>
          )}
          {/* Mobile toggle */}
          <button
            className="md:hidden p-2 rounded-md hover:bg-accent transition-colors"
            onClick={() => setOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-background/95 backdrop-blur-md border-b border-border px-6 py-4 flex flex-col gap-4">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              onClick={() => setOpen(false)}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors py-1"
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  )
}
