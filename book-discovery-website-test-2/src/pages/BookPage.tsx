import { useParams, Link } from "react-router";
import { getBookBySlug, BOOKS } from "../data/books";
import { getSimilarBooks } from "../lib/discovery";
import { getEntryForBook, addToShelf, removeFromTracker, SHELF_LABELS, SHELF_ORDER, ShelfName } from "../lib/tracker";
import { useState, useEffect } from "react";
import StarRating from "../components/StarRating";
import BookCard from "../components/BookCard";

function formatRatingCount(n: number): string {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(0)}K`;
  return `${n}`;
}

export default function BookPage() {
  const { slug } = useParams<{ slug: string }>();
  const book = slug ? getBookBySlug(slug) : undefined;
  const [trackerEntry, setTrackerEntry] = useState(book ? getEntryForBook(book.id) : undefined);
  const [shelfOpen, setShelfOpen] = useState(false);

  useEffect(() => {
    if (book) setTrackerEntry(getEntryForBook(book.id));
  }, [book]);

  if (!book) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <p className="font-display text-3xl text-muted mb-4">Book not found</p>
        <Link to="/" className="text-burgundy font-body text-sm hover:underline">← Back to home</Link>
      </div>
    );
  }

  const similar = getSimilarBooks(book, 4);
  const hasAmazon = book.amazonEbookUrl || book.amazonPaperbackUrl;

  const handleAddToShelf = (shelf: ShelfName) => {
    addToShelf(book.id, shelf);
    setTrackerEntry(getEntryForBook(book.id));
    setShelfOpen(false);
  };

  const handleRemove = () => {
    removeFromTracker(book.id);
    setTrackerEntry(undefined);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 lg:px-8 py-10">
      {/* Breadcrumb */}
      <nav className="mb-8 text-sm font-body text-muted flex items-center gap-2">
        <Link to="/" className="hover:text-ink transition-colors">Home</Link>
        <span>/</span>
        <Link to={`/books/genre/${encodeURIComponent(book.genres[0])}`} className="hover:text-ink transition-colors">
          {book.genres[0]}
        </Link>
        <span>/</span>
        <span className="text-ink truncate">{book.title}</span>
      </nav>

      {/* Main layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-10 lg:gap-14">
        {/* Left: Cover + actions */}
        <div className="lg:col-span-1">
          <div
            className="w-full max-w-[220px] mx-auto lg:mx-0 aspect-[2/3] rounded-lg overflow-hidden shadow-lg mb-6"
            style={{ backgroundColor: book.coverBg }}
          >
            <img src={book.cover} alt={book.title} className="w-full h-full object-cover" />
          </div>

          {/* Action buttons */}
          <div className="space-y-2 max-w-[220px] mx-auto lg:mx-0">
            {book.isPublicDomain && book.gutenbergUrl && (
              <a
                href={book.gutenbergUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 bg-success text-white py-2.5 rounded font-body font-500 text-sm hover:opacity-90 transition-opacity"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                  <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                </svg>
                Read Free
              </a>
            )}

            {book.librivoxUrl && (
              <a
                href={book.librivoxUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 border border-border text-ink py-2.5 rounded font-body font-500 text-sm hover:bg-card transition-colors"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
                  <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
                </svg>
                Free Audiobook (LibriVox)
              </a>
            )}

            {!book.isPublicDomain && (
              <a
                href="https://www.audible.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 border border-border text-ink py-2.5 rounded font-body font-500 text-sm hover:bg-card transition-colors"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
                  <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
                </svg>
                Find Audiobook
              </a>
            )}

            {book.amazonPaperbackUrl || book.amazonEbookUrl ? (
              <>
                {book.amazonEbookUrl && (
                  <a href={book.amazonEbookUrl} target="_blank" rel="noopener noreferrer" className="w-full flex items-center justify-center gap-2 bg-[#FF9900] text-charcoal py-2.5 rounded font-body font-500 text-sm hover:opacity-90 transition-opacity">
                    Buy Kindle eBook
                  </a>
                )}
                {book.amazonPaperbackUrl && (
                  <a href={book.amazonPaperbackUrl} target="_blank" rel="noopener noreferrer" className="w-full flex items-center justify-center gap-2 border border-border text-ink py-2.5 rounded font-body font-500 text-sm hover:bg-card transition-colors">
                    Buy Paperback (Amazon)
                  </a>
                )}
              </>
            ) : (
              <p className="text-center text-xs font-body text-stone py-1">
                Find this book at your local bookshop or library.
              </p>
            )}

            {/* Add to shelf */}
            <div className="relative">
              {trackerEntry ? (
                <div className="flex gap-1">
                  <div className="flex-1 flex items-center gap-1.5 bg-card border border-border rounded px-3 py-2">
                    <svg className="text-success" width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                    </svg>
                    <span className="text-xs font-body text-ink">{SHELF_LABELS[trackerEntry.shelf]}</span>
                  </div>
                  <button
                    onClick={handleRemove}
                    className="px-2 border border-border rounded text-muted hover:text-ink text-xs transition-colors"
                    title="Remove from shelf"
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <div className="relative">
                  <button
                    onClick={() => setShelfOpen((v) => !v)}
                    className="w-full flex items-center justify-center gap-2 border border-dashed border-stone text-muted py-2.5 rounded font-body text-sm hover:border-burgundy hover:text-burgundy transition-colors"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                    </svg>
                    Add to Shelf
                  </button>
                  {shelfOpen && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-parchment border border-border rounded shadow-lg z-10">
                      {SHELF_ORDER.map((shelf) => (
                        <button
                          key={shelf}
                          onClick={() => handleAddToShelf(shelf)}
                          className="w-full text-left px-4 py-2.5 text-sm font-body text-ink hover:bg-card transition-colors first:rounded-t last:rounded-b"
                        >
                          {SHELF_LABELS[shelf]}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right: Book details */}
        <div className="lg:col-span-3">
          {/* Header */}
          <div className="mb-6 pb-6 border-b border-border">
            <h1 className="font-display text-3xl lg:text-4xl font-500 text-ink leading-tight mb-1">
              {book.title}
            </h1>
            <p className="font-display italic text-stone text-lg mb-3">
              by{" "}
              <Link to={`/authors/${book.authorSlug}`} className="hover:text-burgundy transition-colors">
                {book.author}
              </Link>
            </p>
            <div className="flex flex-wrap items-center gap-4 mb-4">
              <StarRating rating={book.rating} size="md" />
              <span className="text-muted text-sm font-body">{formatRatingCount(book.ratingCount)} ratings</span>
            </div>
            <div className="flex flex-wrap gap-3 text-sm font-body text-muted">
              <span className="flex items-center gap-1">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                  <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                </svg>
                {book.pages} pages
              </span>
              <span>·</span>
              <span className="capitalize">{book.difficulty}</span>
              <span>·</span>
              <span className="capitalize">{book.length} read</span>
              <span>·</span>
              <span>{book.year > 0 ? book.year : `${Math.abs(book.year)} BC`}</span>
            </div>
          </div>

          {/* Genres */}
          <div className="flex flex-wrap gap-2 mb-6">
            {book.genres.map((g) => (
              <Link
                key={g}
                to={`/books/genre/${encodeURIComponent(g)}`}
                className="px-3 py-1.5 bg-card border border-border rounded-full text-sm font-body text-ink hover:border-burgundy transition-colors"
              >
                {g}
              </Link>
            ))}
          </div>

          {/* Description */}
          <div className="mb-8">
            <h2 className="font-display text-xl font-500 text-ink mb-3">Description</h2>
            <p className="font-body text-ink leading-relaxed dropcap">{book.description}</p>
          </div>

          {/* Why this book — curated only */}
          {book.whyThisBook && (
            <div className="mb-8 bg-card border-l-4 border-burgundy pl-6 py-4 pr-4 rounded-r-lg">
              <h2 className="font-display text-base font-500 text-burgundy mb-2">Why this book</h2>
              <p className="font-body text-ink leading-relaxed text-sm">{book.whyThisBook}</p>
            </div>
          )}

          {/* Key info */}
          <div className="mb-8">
            <h2 className="font-display text-xl font-500 text-ink mb-4">Key Information</h2>
            <div className="grid grid-cols-2 gap-0 border border-border rounded-lg overflow-hidden">
              {[
                ["Author", book.author],
                ["First Published", book.year > 0 ? book.year.toString() : `${Math.abs(book.year)} BC`],
                ["Pages", book.pages.toString()],
                ["Language", book.language],
                ["Difficulty", book.difficulty.charAt(0).toUpperCase() + book.difficulty.slice(1)],
                ["Era", book.era.charAt(0).toUpperCase() + book.era.slice(1)],
                ["Length", book.length.charAt(0).toUpperCase() + book.length.slice(1)],
                ["Public Domain", book.isPublicDomain ? "Yes — free to read" : "No"],
              ].map(([k, v], i) => (
                <div key={k} className={`flex flex-col p-4 ${i % 2 === 0 ? "border-r" : ""} border-b border-border last:border-b-0`}>
                  <span className="text-[11px] font-body font-600 uppercase tracking-wider text-muted mb-1">{k}</span>
                  <span className="text-sm font-body text-ink">{v}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Editions */}
          {book.editions.length > 0 && (
            <div className="mb-8">
              <h2 className="font-display text-xl font-500 text-ink mb-4">Editions</h2>
              <div className="space-y-2">
                {book.editions.map((ed, i) => (
                  <div key={i} className="flex items-center justify-between py-3 border-b border-border-light last:border-0">
                    <div>
                      <span className="text-sm font-body font-500 text-ink">{ed.type}</span>
                      <span className="text-muted font-body text-sm ml-2">— {ed.publisher}</span>
                    </div>
                    <span className="text-muted font-body text-sm">{ed.year}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Similar books */}
      {similar.length > 0 && (
        <section className="mt-16 pt-10 border-t border-border">
          <h2 className="font-display text-2xl font-500 text-ink mb-6">Similar Books</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            {similar.map(({ book: b, explanation }) => (
              <div key={b.id}>
                <BookCard book={b} size="sm" />
                {explanation && (
                  <p className="text-[11px] font-body text-stone mt-1 leading-snug">{explanation}</p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
