import { useParams, Link } from "react-router";
import { getBooksByGenre, GENRES } from "../data/books";
import BookCard from "../components/BookCard";

export default function GenrePage() {
  const { genre } = useParams<{ genre: string }>();
  const decoded = genre ? decodeURIComponent(genre) : "";
  const books = decoded ? getBooksByGenre(decoded) : [];

  const isValidGenre = GENRES.includes(decoded);

  if (!isValidGenre && decoded) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <p className="font-display text-3xl text-muted mb-4">Genre not found</p>
        <Link to="/" className="text-burgundy font-body text-sm hover:underline">← Back to home</Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-10">
      {/* Header */}
      <div className="mb-10 pb-8 border-b border-border">
        <nav className="text-sm font-body text-muted mb-4 flex items-center gap-2">
          <Link to="/" className="hover:text-ink transition-colors">Home</Link>
          <span>/</span>
          <span className="text-ink">Browse</span>
          <span>/</span>
          <span className="text-ink">{decoded}</span>
        </nav>
        <h1 className="font-display text-4xl lg:text-5xl font-500 text-ink mb-2">{decoded}</h1>
        <p className="text-muted font-body">{books.length} books in this genre</p>
      </div>

      {/* Browse other genres */}
      <div className="mb-8">
        <p className="text-xs font-body font-600 uppercase tracking-widest text-muted mb-3">Browse other genres</p>
        <div className="flex flex-wrap gap-2">
          {GENRES.filter((g) => g !== decoded).map((g) => (
            <Link
              key={g}
              to={`/books/genre/${encodeURIComponent(g)}`}
              className="px-3 py-1.5 border border-border rounded-full text-xs font-body text-muted hover:border-burgundy hover:text-ink transition-colors"
            >
              {g}
            </Link>
          ))}
        </div>
      </div>

      {/* Books grid */}
      {books.length === 0 ? (
        <div className="text-center py-20">
          <p className="font-display text-2xl text-muted mb-4">No books in this genre yet</p>
          <Link to="/discover" className="text-burgundy font-body text-sm hover:underline">Try the discovery engine →</Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
          {books.map((book) => (
            <BookCard key={book.id} book={book} size="md" />
          ))}
        </div>
      )}
    </div>
  );
}
