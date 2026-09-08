import { Link } from "react-router";
import { BOOKS, GENRES, getFeaturedBook, getTrendingBooks } from "../data/books";
import { COLLECTIONS } from "../data/collections";
import BookCard from "../components/BookCard";
import StarRating from "../components/StarRating";

const BROWSE_GENRES = [
  "Fiction", "Fantasy", "Science Fiction", "Philosophy",
  "Classic", "Non-Fiction", "Historical Fiction", "Dystopia",
  "Adventure", "Self-Help", "Psychology", "Magical Realism",
];

export default function HomePage() {
  const featured = getFeaturedBook();
  const trending = getTrendingBooks().slice(0, 6);
  const publicDomain = BOOKS.filter((b) => b.isPublicDomain).slice(0, 4);
  const curated = BOOKS.filter((b) => b.isCurated && !b.featured).slice(0, 6);

  return (
    <div>
      {/* Hero */}
      <section className="bg-charcoal text-parchment">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-16 lg:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16 items-center">
            {/* Text */}
            <div className="lg:col-span-3">
              <p className="text-gold font-body text-xs uppercase tracking-widest mb-4">Featured Pick</p>
              <h1 className="font-display text-4xl lg:text-6xl font-500 leading-tight mb-4">
                {featured.title}
              </h1>
              <p className="font-display italic text-parchment/70 text-lg mb-2">{featured.author}</p>
              <div className="flex items-center gap-4 mb-6">
                <StarRating rating={featured.rating} size="md" />
                <span className="text-parchment/50 text-sm font-body">{featured.pages} pages</span>
                <span className="text-parchment/50 text-sm font-body capitalize">{featured.difficulty}</span>
              </div>
              <p className="text-parchment/70 font-body leading-relaxed text-base max-w-xl mb-8">
                {featured.whyThisBook ?? featured.description}
              </p>
              <div className="flex gap-3 flex-wrap">
                <Link
                  to={`/books/${featured.slug}`}
                  className="bg-gold text-charcoal px-6 py-3 rounded font-body font-600 text-sm hover:bg-gold-light transition-colors"
                >
                  Read More
                </Link>
                <Link
                  to="/discover"
                  className="border border-parchment/30 text-parchment px-6 py-3 rounded font-body font-500 text-sm hover:border-parchment/60 transition-colors"
                >
                  Find Your Next Book
                </Link>
              </div>
            </div>

            {/* Featured cover */}
            <div className="lg:col-span-2 flex justify-center lg:justify-end">
              <Link to={`/books/${featured.slug}`} className="group">
                <div
                  className="w-52 h-80 lg:w-64 lg:h-96 rounded-lg overflow-hidden shadow-2xl group-hover:shadow-3xl transition-shadow"
                  style={{ backgroundColor: featured.coverBg }}
                >
                  <img
                    src={featured.cover}
                    alt={featured.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Divider strip */}
      <div className="bg-burgundy h-1" />

      {/* Trending */}
      <section className="max-w-7xl mx-auto px-4 lg:px-8 py-14">
        <div className="flex items-baseline justify-between mb-8">
          <div>
            <h2 className="font-display text-2xl lg:text-3xl font-500 text-ink">Trending Now</h2>
            <p className="text-muted text-sm font-body mt-1">What readers are picking up this season</p>
          </div>
          <Link to="/search" className="text-sm font-body text-burgundy hover:underline">See all →</Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
          {trending.map((book) => (
            <BookCard key={book.id} book={book} size="sm" />
          ))}
        </div>
      </section>

      <hr className="border-border-light max-w-7xl mx-auto" />

      {/* What should I read + Browse */}
      <section className="max-w-7xl mx-auto px-4 lg:px-8 py-14">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Discovery CTA */}
          <div className="lg:col-span-1">
            <div className="bg-card border border-border rounded-lg p-8 h-full flex flex-col justify-between">
              <div>
                <p className="text-gold font-body text-xs uppercase tracking-widest mb-3">Book Discovery</p>
                <h2 className="font-display text-2xl font-500 text-ink leading-tight mb-4">
                  What should I read next?
                </h2>
                <p className="text-muted font-body text-sm leading-relaxed">
                  Tell us your mood, your favorite genres, and how much time you have. We'll find your next book — no algorithms, just editorial judgment.
                </p>
              </div>
              <Link
                to="/discover"
                className="mt-6 inline-block bg-burgundy text-parchment px-5 py-3 rounded font-body font-500 text-sm hover:bg-burgundy-light transition-colors text-center"
              >
                Find My Book →
              </Link>
            </div>
          </div>

          {/* Browse genres */}
          <div className="lg:col-span-2">
            <h2 className="font-display text-2xl font-500 text-ink mb-6">Browse by Genre</h2>
            <div className="flex flex-wrap gap-2">
              {BROWSE_GENRES.map((genre) => (
                <Link
                  key={genre}
                  to={`/books/genre/${encodeURIComponent(genre)}`}
                  className="px-4 py-2 border border-border rounded-full text-sm font-body text-ink hover:bg-card hover:border-burgundy transition-colors"
                >
                  {genre}
                </Link>
              ))}
            </div>
            <div className="mt-8 grid grid-cols-2 gap-4">
              {[
                { label: "Free Classics", href: "/free-books", desc: "Public domain books you can read right now" },
                { label: "Short Books", href: "/best/short-books", desc: "Finish in a weekend. Big ideas, small pages." },
              ].map(({ label, href, desc }) => (
                <Link key={href} to={href} className="group border border-border rounded-lg p-5 hover:border-burgundy hover:bg-card transition-colors">
                  <h3 className="font-display font-500 text-ink group-hover:text-burgundy transition-colors">{label}</h3>
                  <p className="text-muted text-xs font-body mt-1">{desc}</p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Curated Collections */}
      <section className="bg-card border-y border-border">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-14">
          <div className="flex items-baseline justify-between mb-8">
            <div>
              <h2 className="font-display text-2xl lg:text-3xl font-500 text-ink">Curated Collections</h2>
              <p className="text-muted text-sm font-body mt-1">Human-made lists on the topics that matter</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {COLLECTIONS.map((col) => (
              <Link
                key={col.slug}
                to={`/best/${col.slug}`}
                className="group relative rounded-lg overflow-hidden aspect-[4/2.2]"
              >
                <div style={{ backgroundColor: col.coverBg }} className="absolute inset-0" />
                <img
                  src={col.coverImage}
                  alt={col.title}
                  className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:opacity-50 transition-opacity"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 p-5">
                  <p className="text-gold text-[11px] font-body uppercase tracking-wider mb-1">Best of</p>
                  <h3 className="font-display font-500 text-white text-lg leading-tight group-hover:text-gold-light transition-colors">
                    {col.title}
                  </h3>
                  <p className="text-white/60 text-xs font-body mt-1">{col.bookSlugs.length} books</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Curated Books Grid */}
      <section className="max-w-7xl mx-auto px-4 lg:px-8 py-14">
        <div className="flex items-baseline justify-between mb-8">
          <div>
            <h2 className="font-display text-2xl lg:text-3xl font-500 text-ink">Essential Reading</h2>
            <p className="text-muted text-sm font-body mt-1">Books we recommend without hesitation</p>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
          {curated.map((book) => (
            <BookCard key={book.id} book={book} size="sm" />
          ))}
        </div>
      </section>

      {/* Free / Public Domain */}
      <section className="bg-charcoal text-parchment">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-14">
          <div className="flex items-baseline justify-between mb-8">
            <div>
              <p className="text-gold font-body text-xs uppercase tracking-widest mb-2">No cost, always</p>
              <h2 className="font-display text-2xl lg:text-3xl font-500">Free to Read</h2>
              <p className="text-parchment/60 text-sm font-body mt-1">Public domain masterworks — yours forever</p>
            </div>
            <Link to="/free-books" className="text-sm font-body text-gold hover:underline">Browse all →</Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            {publicDomain.map((book) => (
              <Link key={book.id} to={`/books/${book.slug}`} className="group">
                <div
                  className="w-full aspect-[2/3] rounded overflow-hidden mb-3"
                  style={{ backgroundColor: book.coverBg }}
                >
                  <img
                    src={book.cover}
                    alt={book.title}
                    className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                  />
                </div>
                <h3 className="font-display font-400 text-parchment text-sm leading-tight group-hover:text-gold transition-colors">
                  {book.title}
                </h3>
                <p className="text-parchment/50 text-xs font-body mt-0.5">{book.author}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Reading tracker CTA */}
      <section className="max-w-7xl mx-auto px-4 lg:px-8 py-14">
        <div className="flex flex-col lg:flex-row items-center gap-6 bg-card border border-border rounded-xl p-8 lg:p-10">
          <div className="flex-1">
            <p className="text-burgundy font-body text-xs uppercase tracking-widest mb-2">Reading Tracker</p>
            <h2 className="font-display text-2xl font-500 text-ink mb-2">Track your reading journey</h2>
            <p className="text-muted font-body text-sm leading-relaxed max-w-md">
              Build your personal library. Set yearly goals, organize books into shelves, and mark your progress — all stored locally, no account required.
            </p>
          </div>
          <Link
            to="/tracker"
            className="flex-shrink-0 bg-burgundy text-parchment px-6 py-3 rounded font-body font-500 text-sm hover:bg-burgundy-light transition-colors"
          >
            Open My Shelf →
          </Link>
        </div>
      </section>
    </div>
  );
}
