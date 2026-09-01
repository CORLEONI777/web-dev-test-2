import { useParams, Link } from "react-router";
import { getCollectionBySlug, COLLECTIONS } from "../data/collections";
import { getBookBySlug } from "../data/books";
import StarRating from "../components/StarRating";

export default function CollectionPage() {
  const { slug } = useParams<{ slug: string }>();
  const collection = slug ? getCollectionBySlug(slug) : undefined;

  if (!collection) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <p className="font-display text-3xl text-muted mb-4">Collection not found</p>
        <Link to="/" className="text-burgundy font-body text-sm hover:underline">← Back to home</Link>
      </div>
    );
  }

  const books = collection.bookSlugs.map((s) => getBookBySlug(s)).filter(Boolean);

  return (
    <div>
      {/* Hero */}
      <div className="relative h-56 lg:h-72 overflow-hidden" style={{ backgroundColor: collection.coverBg }}>
        <img
          src={collection.coverImage}
          alt={collection.title}
          className="absolute inset-0 w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60" />
        <div className="relative max-w-6xl mx-auto px-4 lg:px-8 h-full flex flex-col justify-end pb-8">
          <p className="text-gold font-body text-xs uppercase tracking-widest mb-2">Curated List</p>
          <h1 className="font-display text-3xl lg:text-4xl font-500 text-white leading-tight">
            {collection.title}
          </h1>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-20">
              <p className="text-muted font-body text-sm leading-relaxed mb-6">{collection.description}</p>
              <div className="mb-6">
                <p className="text-xs font-body font-600 uppercase tracking-widest text-muted mb-3">Other Lists</p>
                <ul className="space-y-2">
                  {COLLECTIONS.filter((c) => c.slug !== collection.slug).slice(0, 5).map((c) => (
                    <li key={c.slug}>
                      <Link
                        to={`/best/${c.slug}`}
                        className="text-sm font-body text-muted hover:text-burgundy transition-colors leading-snug"
                      >
                        {c.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Books */}
          <div className="lg:col-span-3">
            <p className="text-muted font-body text-sm mb-6">{books.length} books in this collection</p>
            <div className="space-y-0">
              {books.map((book, i) => {
                if (!book) return null;
                return (
                  <div key={book.id} className="flex gap-5 py-7 border-b border-border-light last:border-0">
                    {/* Rank */}
                    <div className="w-10 flex-shrink-0 flex items-start pt-1">
                      <span className="font-display text-2xl font-300 text-stone leading-none">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                    </div>

                    {/* Cover */}
                    <Link to={`/books/${book.slug}`} className="flex-shrink-0 group">
                      <div
                        className="w-20 h-28 rounded overflow-hidden shadow-sm group-hover:shadow-md transition-shadow"
                        style={{ backgroundColor: book.coverBg }}
                      >
                        <img src={book.cover} alt={book.title} className="w-full h-full object-cover" />
                      </div>
                    </Link>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <Link to={`/books/${book.slug}`} className="group">
                        <h2 className="font-display font-500 text-ink text-xl leading-tight group-hover:text-burgundy transition-colors mb-0.5">
                          {book.title}
                        </h2>
                      </Link>
                      <p className="font-body text-stone text-sm mb-2">
                        <Link to={`/authors/${book.authorSlug}`} className="hover:text-burgundy transition-colors">
                          {book.author}
                        </Link>
                      </p>
                      <div className="flex items-center gap-3 mb-3">
                        <StarRating rating={book.rating} />
                        <span className="text-muted text-xs font-body">{book.pages} pages</span>
                        <span className="text-muted text-xs font-body capitalize">{book.difficulty}</span>
                        {book.isPublicDomain && (
                          <span className="text-success text-xs font-body font-500">Free</span>
                        )}
                      </div>
                      <p className="text-muted font-body text-sm leading-relaxed line-clamp-3">{book.description}</p>
                      {book.whyThisBook && (
                        <p className="mt-2 text-burgundy font-body text-xs italic leading-relaxed line-clamp-2">
                          "{book.whyThisBook.slice(0, 140)}..."
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
