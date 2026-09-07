import { Link } from "react-router";
import { Book } from "../data/books";
import StarRating from "./StarRating";

interface BookCardProps {
  book: Book;
  size?: "sm" | "md" | "lg";
  showDescription?: boolean;
  rank?: number;
}

export default function BookCard({ book, size = "md", showDescription = false, rank }: BookCardProps) {
  const coverHeight = size === "sm" ? "h-48" : size === "lg" ? "h-72" : "h-56";
  const coverWidth = size === "sm" ? "w-32" : size === "lg" ? "w-48" : "w-36";

  return (
    <Link
      to={`/books/${book.slug}`}
      className="group flex flex-col hover:opacity-90 transition-opacity"
    >
      {/* Cover */}
      <div
        className={`relative ${coverWidth} ${coverHeight} rounded overflow-hidden flex-shrink-0 mb-3`}
        style={{ backgroundColor: book.coverBg }}
      >
        <img
          src={book.cover}
          alt={`Cover of ${book.title}`}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        {rank !== undefined && (
          <div className="absolute top-2 left-2 w-6 h-6 bg-burgundy text-parchment rounded-full flex items-center justify-center text-xs font-body font-600">
            {rank}
          </div>
        )}
        {book.isPublicDomain && (
          <div className="absolute bottom-2 right-2 bg-success text-white text-[10px] px-1.5 py-0.5 rounded font-body font-500">
            FREE
          </div>
        )}
      </div>

      {/* Meta */}
      <div className="flex-1">
        <h3 className="font-display font-500 text-ink leading-tight group-hover:text-burgundy transition-colors"
          style={{ fontSize: size === "sm" ? "0.9rem" : "1rem" }}>
          {book.title}
        </h3>
        <p className="text-stone text-sm font-body mt-0.5">{book.author}</p>
        <div className="mt-1">
          <StarRating rating={book.rating} size="sm" />
        </div>
        <div className="flex flex-wrap gap-1 mt-2">
          {book.genres.slice(0, 2).map((g) => (
            <span
              key={g}
              className="text-[11px] font-body text-muted bg-card px-2 py-0.5 rounded-full border border-border-light"
            >
              {g}
            </span>
          ))}
        </div>
        {showDescription && (
          <p className="text-muted text-sm font-body mt-2 leading-relaxed line-clamp-3">
            {book.description}
          </p>
        )}
      </div>
    </Link>
  );
}

export function BookCardHorizontal({ book }: { book: Book }) {
  return (
    <Link
      to={`/books/${book.slug}`}
      className="group flex gap-4 py-4 border-b border-border-light last:border-0 hover:opacity-90 transition-opacity"
    >
      <div
        className="w-14 h-20 rounded overflow-hidden flex-shrink-0"
        style={{ backgroundColor: book.coverBg }}
      >
        <img
          src={book.cover}
          alt={`Cover of ${book.title}`}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-display font-500 text-ink text-[0.95rem] leading-tight group-hover:text-burgundy transition-colors truncate">
          {book.title}
        </h3>
        <p className="text-stone text-xs font-body mt-0.5">{book.author}</p>
        <StarRating rating={book.rating} size="sm" />
        <p className="text-muted text-xs font-body mt-1 line-clamp-2 leading-relaxed">
          {book.description}
        </p>
      </div>
    </Link>
  );
}
