import Link from "next/link"
import { Github, Linkedin, Rss } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t border-border bg-background/50 backdrop-blur-sm">
      <div className="mx-auto max-w-6xl px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Identity */}
        <div className="text-center md:text-left">
          <p className="font-mono font-semibold text-foreground">
            <span className="text-primary">{">"}</span> Jag Patel
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">Principal AI/ML Engineer</p>
          <p className="text-xs text-muted-foreground mt-0.5">Melbourne, Australia</p>
        </div>

        {/* Nav */}
        <nav className="flex items-center gap-6 text-sm text-muted-foreground">
          {["About", "Projects", "Certifications", "Education", "Blog", "Contact"].map((item) => (
            <Link
              key={item}
              href={item === 'Contact' ? '/contact' : item === 'Projects' ? '/projects' : item === 'About' ? '/about' : item === 'Certifications' ? '/certifications' : item === 'Education' ? '/education' : `/#${item.toLowerCase()}`}
              className="hover:text-foreground transition-colors"
            >
              {item}
            </Link>
          ))}
        </nav>

        {/* Social + copyright */}
        <div className="flex flex-col items-center md:items-end gap-2">
          <div className="flex items-center gap-4">
            <a
              href="https://github.com/JagdishkumarPatel"
              target="_blank"
              rel="noreferrer"
              aria-label="GitHub"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <Github className="h-4 w-4" />
            </a>
            <a
              href="https://www.linkedin.com/in/jagjpatel/"
              target="_blank"
              rel="noreferrer"
              aria-label="LinkedIn"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <Linkedin className="h-4 w-4" />
            </a>
            <a
              href="/rss/feed.xml"
              target="_blank"
              rel="noreferrer"
              aria-label="RSS Feed"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <Rss className="h-4 w-4" />
            </a>
          </div>
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Jag Patel
          </p>
        </div>
      </div>
    </footer>
  )
}
