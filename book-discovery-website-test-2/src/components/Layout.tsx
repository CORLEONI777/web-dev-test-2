import { Link, NavLink, Outlet, useNavigate } from "react-router";
import { useState } from "react";

export default function Layout() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
      setSearchOpen(false);
      setQuery("");
    }
  };

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `text-sm font-body font-500 transition-colors ${
      isActive ? "text-burgundy" : "text-muted hover:text-ink"
    }`;

  return (
    <div className="min-h-screen flex flex-col bg-parchment text-ink">
      {/* Top announcement bar */}
      <div className="bg-burgundy text-parchment text-center text-xs font-body py-2 px-4">
        Explore 200+ curated books — free public domain classics always available to read
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 bg-parchment border-b border-border">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 h-14 flex items-center justify-between gap-6">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0">
            <span className="font-display text-xl font-600 tracking-tight text-ink">
              LIBRARIUM
            </span>
          </Link>

          {/* Nav links — desktop */}
          <nav className="hidden md:flex items-center gap-7">
            <NavLink to="/discover" className={navLinkClass}>Discover</NavLink>
            <NavLink to="/books/genre/Fantasy" className={navLinkClass}>Browse</NavLink>
            <NavLink to="/free-books" className={navLinkClass}>Free Books</NavLink>
            <NavLink to="/tracker" className={navLinkClass}>My Books</NavLink>
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSearchOpen((v) => !v)}
              aria-label="Search"
              className="text-muted hover:text-ink transition-colors p-1.5"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
            </button>

            <Link to="/tracker" className="hidden md:flex items-center gap-1.5 text-sm font-body text-muted hover:text-ink transition-colors">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
              </svg>
              <span>Shelf</span>
            </Link>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="md:hidden text-muted hover:text-ink transition-colors p-1.5"
              aria-label="Menu"
            >
              {menuOpen ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                  <path d="M3 6h18M3 12h18M3 18h18" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Search bar */}
        {searchOpen && (
          <div className="border-t border-border bg-parchment">
            <div className="max-w-7xl mx-auto px-4 lg:px-8 py-3">
              <form onSubmit={handleSearch} className="flex gap-2">
                <input
                  autoFocus
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search books, authors, genres..."
                  className="flex-1 bg-card border border-border rounded px-4 py-2 text-sm font-body text-ink placeholder:text-stone-light focus:outline-none focus:border-burgundy"
                />
                <button
                  type="submit"
                  className="bg-burgundy text-parchment px-4 py-2 rounded text-sm font-body font-500 hover:bg-burgundy-light transition-colors"
                >
                  Search
                </button>
                <button
                  type="button"
                  onClick={() => setSearchOpen(false)}
                  className="text-muted hover:text-ink px-2 py-2 text-sm font-body transition-colors"
                >
                  Cancel
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-border bg-parchment">
            <nav className="max-w-7xl mx-auto px-4 py-4 flex flex-col gap-4">
              <NavLink to="/discover" className={navLinkClass} onClick={() => setMenuOpen(false)}>Discover</NavLink>
              <NavLink to="/books/genre/Fantasy" className={navLinkClass} onClick={() => setMenuOpen(false)}>Browse</NavLink>
              <NavLink to="/free-books" className={navLinkClass} onClick={() => setMenuOpen(false)}>Free Books</NavLink>
              <NavLink to="/tracker" className={navLinkClass} onClick={() => setMenuOpen(false)}>My Books</NavLink>
            </nav>
          </div>
        )}
      </header>

      {/* Main content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-charcoal text-parchment mt-16">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-1">
              <span className="font-display text-lg font-500 tracking-tight">LIBRARIUM</span>
              <p className="mt-2 text-stone-light text-sm font-body leading-relaxed">
                Your guide to the world's greatest books. Curated, not algorithmic.
              </p>
            </div>
            <div>
              <h4 className="font-body font-600 text-xs uppercase tracking-widest text-stone-light mb-3">Discover</h4>
              <ul className="space-y-2">
                {[["What to Read", "/discover"], ["Trending Books", "/"], ["Free Books", "/free-books"], ["Classics", "/books/genre/Classic"]].map(([label, href]) => (
                  <li key={href}>
                    <Link to={href} className="text-sm font-body text-parchment/70 hover:text-parchment transition-colors">{label}</Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-body font-600 text-xs uppercase tracking-widest text-stone-light mb-3">Genres</h4>
              <ul className="space-y-2">
                {[["Fiction", "Fiction"], ["Fantasy", "Fantasy"], ["Philosophy", "Philosophy"], ["Science Fiction", "Science Fiction"]].map(([label, genre]) => (
                  <li key={genre}>
                    <Link to={`/books/genre/${encodeURIComponent(genre)}`} className="text-sm font-body text-parchment/70 hover:text-parchment transition-colors">{label}</Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-body font-600 text-xs uppercase tracking-widest text-stone-light mb-3">Lists</h4>
              <ul className="space-y-2">
                {[
                  ["Best Philosophy Books", "/best/philosophy-books"],
                  ["Best Short Books", "/best/short-books"],
                  ["Best Dystopian Fiction", "/best/dystopian-fiction"],
                  ["Best Fantasy Books", "/best/fantasy-books"],
                ].map(([label, href]) => (
                  <li key={href}>
                    <Link to={href} className="text-sm font-body text-parchment/70 hover:text-parchment transition-colors">{label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="mt-10 pt-6 border-t border-parchment/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <p className="text-stone-light text-xs font-body">
              © {new Date().getFullYear()} Librarium. Book links may include affiliate relationships.
            </p>
            <p className="text-stone-light text-xs font-body">
              Public domain texts via Project Gutenberg and LibriVox.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
