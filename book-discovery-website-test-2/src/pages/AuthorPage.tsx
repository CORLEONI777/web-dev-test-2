import { useParams, Link } from "react-router";
import { getBooksByAuthor, BOOKS } from "../data/books";
import BookCard from "../components/BookCard";

export default function AuthorPage() {
  const { slug } = useParams<{ slug: string }>();
  const books = slug ? getBooksByAuthor(slug) : [];
  const author = books[0]?.author ?? "";

  if (!author) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <p className="font-display text-3xl text-muted mb-4">Author not found</p>
        <Link to="/" className="text-burgundy font-body text-sm hover:underline">← Back to home</Link>
      </div>
    );
  }

  const avgRating = books.reduce((sum, b) => sum + b.rating, 0) / books.length;
  const genres = [...new Set(books.flatMap((b) => b.genres))];

  return (
    <div className="max-w-6xl mx-auto px-4 lg:px-8 py-10">
      <nav className="text-sm font-body text-muted mb-8 flex items-center gap-2">
        <Link to="/" className="hover:text-ink transition-colors">Home</Link>
        <span>/</span>
        <span className="text-ink">{author}</span>
      </nav>

      <div className="mb-10 pb-10 border-b border-border">
        <h1 className="font-display text-4xl lg:text-5xl font-500 text-ink mb-3">{author}</h1>
        <div className="flex flex-wrap gap-4 text-sm font-body text-muted">
          <span>{books.length} book{books.length !== 1 ? "s" : ""} in our catalog</span>
          <span>·</span>
          <span>Avg rating {avgRating.toFixed(1)}</span>
        </div>
        <div className="flex flex-wrap gap-2 mt-4">
          {genres.map((g) => (
            <Link
              key={g}
              to={`/books/genre/${encodeURIComponent(g)}`}
              className="px-3 py-1.5 bg-card border border-border rounded-full text-xs font-body text-ink hover:border-burgundy transition-colors"
            >
              {g}
            </Link>
          ))}
        </div>
      </div>

      <h2 className="font-display text-2xl font-500 text-ink mb-6">Books by {author}</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
        {books.map((book) => (
          <BookCard key={book.id} book={book} size="md" />
        ))}
      </div>
    </div>
  );
}
