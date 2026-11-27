import { Link } from "@tanstack/react-router";
import { ThemeToggle } from "./theme-toggle";

export function SiteFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-paper text-ink">
      <header className="bg-navy text-header-fg">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <Link to="/" className="text-xl font-extrabold">
            demand<span className="text-orange">ing</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link to="/about" className="text-sm hover:underline">About</Link>
            <Link to="/articles" className="text-sm hover:underline">Articles</Link>
            <ThemeToggle />
          </div>
        </div>
      </header>
      <main>{children}</main>
      <footer className="border-t border-line bg-mist py-8 text-center text-sm text-muted">
        <p>As an Amazon Associate I earn from qualifying purchases.</p>
        <div className="mt-2 flex justify-center gap-4">
          <Link to="/privacy" className="hover:underline">Privacy</Link>
          <Link to="/terms" className="hover:underline">Terms</Link>
          <Link to="/disclosure" className="hover:underline">Disclosure</Link>
        </div>
      </footer>
    </div>
  );
}