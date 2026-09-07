import { useSearchParams, Link } from "react-router";
import { useState, useMemo } from "react";
import { BOOKS, searchBooks, GENRES } from "../data/books";
import BookCard from "../components/BookCard";

const DIFFICULTY_OPTIONS = ["easy", "medium", "hard"];
const LENGTH_OPTIONS = [
  { label: "Short (< 200 pages)", value: "short" },
  { label: "Medium (200–400)", value: "medium" },
  { label: "Long (400+)", value: "long" },
];

export default function SearchPage() {
  const [params, setParams] = useSearchParams();
  const query = params.get("q") ?? "";
  const [localQuery, setLocalQuery] = useState(query);
  const [genreFilter, setGenreFilter] = useState("");
  const [diffFilter, setDiffFilter] = useState("");
  const [lengthFilter, setLengthFilter] = useState("");
  const [domainFilter, setDomainFilter] = useState("");

  const results = useMemo(() => {
    let books = query ? searchBooks(query) : [...BOOKS];
    if (genreFilter) books = books.filter((b) => b.genres.includes(genreFilter));
    if (diffFilter) books = books.filter((b) => b.difficulty === diffFilter);
    if (lengthFilter) books = books.filter((b) => b.length === lengthFilter);
    if (domainFilter === "free") books = books.filter((b) => b.isPublicDomain);
    return books;
  }, [query, genreFilter, diffFilter, lengthFilter, domainFilter]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setParams(localQuery.trim() ? { q: localQuery.trim() } : {});
  };

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-500 text-ink mb-2">
          {query ? `Results for "${query}"` : "Browse All Books"}
        </h1>
        <p className="text-muted font-body text-sm">{results.length} books found</p>
      </div>

      {/* Search bar */}
      <form onSubmit={handleSearch} className="flex gap-2 mb-8">
        <input
          type="text"
          value={localQuery}
          onChange={(e) => setLocalQuery(e.target.value)}
          placeholder="Search by title, author, genre, or topic..."
          className="flex-1 bg-card border border-border rounded px-4 py-2.5 text-sm font-body text-ink placeholder:text-stone focus:outline-none focus:border-burgundy"
        />
        <button
          type="submit"
          className="bg-burgundy text-parchment px-5 py-2.5 rounded font-body font-500 text-sm hover:bg-burgundy-light transition-colors"
        >
          Search
        </button>
      </form>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar filters */}
        <aside className="lg:w-52 flex-shrink-0">
          <div className="sticky top-20 space-y-6">
            <div>
              <h3 className="font-body font-600 text-xs uppercase tracking-widest text-muted mb-3">Genre</h3>
              <select
                value={genreFilter}
                onChange={(e) => setGenreFilter(e.target.value)}
                className="w-full bg-card border border-border rounded px-3 py-2 text-sm font-body text-ink focus:outline-none focus:border-burgundy"
              >
                <option value="">All genres</option>
                {GENRES.map((g) => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>

            <div>
              <h3 className="font-body font-600 text-xs uppercase tracking-widest text-muted mb-3">Difficulty</h3>
              <div className="space-y-2">
                {["", ...DIFFICULTY_OPTIONS].map((d) => (
                  <label key={d} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="difficulty"
                      value={d}
                      checked={diffFilter === d}
                      onChange={() => setDiffFilter(d)}
                      className="accent-burgundy"
                    />
                    <span className="text-sm font-body text-ink capitalize">{d || "Any"}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-body font-600 text-xs uppercase tracking-widest text-muted mb-3">Length</h3>
              <div className="space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="length" value="" checked={lengthFilter === ""} onChange={() => setLengthFilter("")} className="accent-burgundy" />
                  <span className="text-sm font-body text-ink">Any</span>
                </label>
                {LENGTH_OPTIONS.map(({ label, value }) => (
                  <label key={value} className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="length" value={value} checked={lengthFilter === value} onChange={() => setLengthFilter(value)} className="accent-burgundy" />
                    <span className="text-sm font-body text-ink">{label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-body font-600 text-xs uppercase tracking-widest text-muted mb-3">Access</h3>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={domainFilter === "free"}
                  onChange={(e) => setDomainFilter(e.target.checked ? "free" : "")}
                  className="accent-burgundy"
                />
                <span className="text-sm font-body text-ink">Free to read</span>
              </label>
            </div>

            {(genreFilter || diffFilter || lengthFilter || domainFilter) && (
              <button
                onClick={() => { setGenreFilter(""); setDiffFilter(""); setLengthFilter(""); setDomainFilter(""); }}
                className="text-xs font-body text-burgundy hover:underline"
              >
                Clear filters
              </button>
            )}
          </div>
        </aside>

        {/* Results grid */}
        <div className="flex-1">
          {results.length === 0 ? (
            <div className="text-center py-20">
              <p className="font-display text-2xl text-muted mb-3">No books found</p>
              <p className="text-muted font-body text-sm mb-6">Try adjusting your filters or search for a different term.</p>
              <Link to="/discover" className="text-burgundy font-body text-sm hover:underline">
                Try the Book Discovery engine →
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
              {results.map((book) => (
                <BookCard key={book.id} book={book} size="sm" />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
