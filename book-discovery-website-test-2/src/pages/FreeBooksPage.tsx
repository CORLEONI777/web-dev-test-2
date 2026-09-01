import { Link } from "react-router";
import { getPublicDomainBooks } from "../data/books";
import StarRating from "../components/StarRating";

export default function FreeBooksPage() {
  const books = getPublicDomainBooks();
  const withAudio = books.filter((b) => b.librivoxUrl);

  return (
    <div className="max-w-6xl mx-auto px-4 lg:px-8 py-10">
      {/* Header */}
      <div className="mb-10 pb-8 border-b border-border">
        <p className="text-success font-body text-xs uppercase tracking-widest mb-2">Always free</p>
        <h1 className="font-display text-4xl lg:text-5xl font-500 text-ink mb-3">Free Books to Read</h1>
        <p className="text-muted font-body leading-relaxed max-w-2xl">
          These works are in the public domain and free to read in their entirety. Text via Project Gutenberg.
          Audiobooks via LibriVox, read by volunteers. We verify public domain status for US readers — always check your jurisdiction's rules.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-6 mb-10">
        {[
          { label: "Books available", value: books.length.toString() },
          { label: "With free audiobook", value: withAudio.length.toString() },
          { label: "Cost", value: "£0" },
        ].map(({ label, value }) => (
          <div key={label} className="bg-card border border-border rounded-lg p-5 text-center">
            <p className="font-display text-3xl font-500 text-ink">{value}</p>
            <p className="font-body text-xs text-muted mt-1 uppercase tracking-wide">{label}</p>
          </div>
        ))}
      </div>

      {/* Books list */}
      <div className="space-y-0">
        {books.map((book) => (
          <div key={book.id} className="flex gap-5 py-7 border-b border-border-light last:border-0">
            {/* Cover */}
            <Link to={`/books/${book.slug}`} className="flex-shrink-0 group">
              <div
                className="w-16 h-24 rounded overflow-hidden shadow-sm"
                style={{ backgroundColor: book.coverBg }}
              >
                <img src={book.cover} alt={book.title} className="w-full h-full object-cover" />
              </div>
            </Link>

            {/* Details */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                <div className="min-w-0">
                  <Link to={`/books/${book.slug}`}>
                    <h2 className="font-display font-500 text-ink text-lg leading-tight hover:text-burgundy transition-colors">
                      {book.title}
                    </h2>
                  </Link>
                  <p className="font-body text-stone text-sm mt-0.5">
                    <Link to={`/authors/${book.authorSlug}`} className="hover:text-burgundy transition-colors">
                      {book.author}
                    </Link>
                    <span className="mx-2 text-border">·</span>
                    <span>{book.year > 0 ? book.year : `${Math.abs(book.year)} BC`}</span>
                  </p>
                  <div className="flex items-center gap-3 mt-1">
                    <StarRating rating={book.rating} />
                    <span className="text-muted text-xs font-body">{book.pages} pages</span>
                    <span className="text-muted text-xs font-body capitalize">{book.difficulty}</span>
                  </div>
                  <p className="text-muted font-body text-sm leading-relaxed mt-2 line-clamp-2">{book.description}</p>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2 flex-shrink-0 min-w-[140px]">
                  {book.gutenbergUrl && (
                    <a
                      href={book.gutenbergUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-1.5 bg-success text-white px-4 py-2 rounded text-sm font-body font-500 hover:opacity-90 transition-opacity"
                    >
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
                      className="flex items-center justify-center gap-1.5 border border-border text-ink px-4 py-2 rounded text-sm font-body font-500 hover:bg-card transition-colors"
                    >
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                        <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                        <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
                      </svg>
                      Free Audiobook
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* External resources */}
      <div className="mt-12 pt-8 border-t border-border">
        <h2 className="font-display text-2xl font-500 text-ink mb-6">More free book resources</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {[
            {
              name: "Project Gutenberg",
              url: "https://www.gutenberg.org",
              desc: "70,000+ free ebooks — mostly public domain works, available in multiple formats.",
            },
            {
              name: "LibriVox",
              url: "https://librivox.org",
              desc: "Free public domain audiobooks, read by volunteers. Thousands of titles across all genres.",
            },
            {
              name: "Standard Ebooks",
              url: "https://standardebooks.org",
              desc: "Carefully formatted, beautifully typeset editions of public domain classics.",
            },
          ].map(({ name, url, desc }) => (
            <a
              key={name}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="group border border-border rounded-lg p-5 hover:border-burgundy hover:bg-card transition-colors"
            >
              <h3 className="font-display font-500 text-ink group-hover:text-burgundy transition-colors mb-1">{name}</h3>
              <p className="text-muted font-body text-sm leading-relaxed">{desc}</p>
              <p className="text-burgundy text-xs font-body mt-2">{url.replace("https://", "")} →</p>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
