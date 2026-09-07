import { useState } from "react";
import { Link } from "react-router";
import { GENRES, MOODS, BOOKS } from "../data/books";
import { discoverBooks, DiscoveryInputs, DiscoveryResult } from "../lib/discovery";
import StarRating from "../components/StarRating";

const DEFAULT_INPUTS: DiscoveryInputs = {
  genres: [],
  moods: [],
  length: "",
  difficulty: "",
  era: "",
  similarTo: "",
  fiction: "",
  language: "English",
};

function ResultCard({ result, rank }: { result: DiscoveryResult; rank: number }) {
  const { book, explanation, matchReasons } = result;
  return (
    <div className="border border-border rounded-lg overflow-hidden flex gap-0">
      {/* Rank */}
      <div className="w-10 flex-shrink-0 bg-card flex items-start justify-center pt-5">
        <span className="font-display text-muted text-lg font-500">{rank}</span>
      </div>

      {/* Cover */}
      <div
        className="w-20 flex-shrink-0 h-28 self-stretch"
        style={{ backgroundColor: book.coverBg }}
      >
        <img src={book.cover} alt={book.title} className="w-full h-full object-cover" />
      </div>

      {/* Content */}
      <div className="flex-1 p-4 min-w-0">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
          <div className="min-w-0">
            <Link
              to={`/books/${book.slug}`}
              className="font-display font-500 text-ink hover:text-burgundy transition-colors text-base leading-tight"
            >
              {book.title}
            </Link>
            <p className="text-stone text-sm font-body">{book.author}</p>
          </div>
          <div className="flex-shrink-0">
            <StarRating rating={book.rating} />
          </div>
        </div>

        <div className="flex flex-wrap gap-1 my-2">
          {book.genres.slice(0, 3).map((g) => (
            <span key={g} className="text-[11px] font-body text-muted bg-card px-2 py-0.5 rounded-full border border-border-light">{g}</span>
          ))}
          <span className="text-[11px] font-body text-muted bg-card px-2 py-0.5 rounded-full border border-border-light capitalize">{book.length}</span>
        </div>

        <p className="text-muted text-xs font-body mt-1 leading-relaxed line-clamp-2">{book.description}</p>

        {/* Why this recommendation */}
        {explanation && (
          <div className="mt-2 flex items-start gap-1.5">
            <svg className="text-gold mt-0.5 flex-shrink-0" width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
            <p className="text-xs font-body text-gold">{explanation}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function DiscoverPage() {
  const [inputs, setInputs] = useState<DiscoveryInputs>(DEFAULT_INPUTS);
  const [results, setResults] = useState<DiscoveryResult[]>([]);
  const [searched, setSearched] = useState(false);

  const toggleGenre = (g: string) =>
    setInputs((p) => ({
      ...p,
      genres: p.genres.includes(g) ? p.genres.filter((x) => x !== g) : [...p.genres, g],
    }));

  const toggleMood = (m: string) =>
    setInputs((p) => ({
      ...p,
      moods: p.moods.includes(m) ? p.moods.filter((x) => x !== m) : [...p.moods, m],
    }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setResults(discoverBooks(inputs));
    setSearched(true);
  };

  const handleReset = () => {
    setInputs(DEFAULT_INPUTS);
    setResults([]);
    setSearched(false);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 lg:px-8 py-12">
      {/* Header */}
      <div className="mb-10">
        <p className="text-burgundy font-body text-xs uppercase tracking-widest mb-2">Book Discovery</p>
        <h1 className="font-display text-3xl lg:text-4xl font-500 text-ink mb-3">What should I read next?</h1>
        <p className="text-muted font-body leading-relaxed max-w-xl">
          Tell us what you're in the mood for. We'll match you with books that fit — using shared genres, mood, length, and era, not a black-box algorithm.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
        {/* Form */}
        <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-6">
          {/* Fiction toggle */}
          <div>
            <label className="font-body font-600 text-xs uppercase tracking-widest text-muted block mb-3">
              Fiction or Non-Fiction?
            </label>
            <div className="flex gap-2">
              {(["", "fiction", "non-fiction"] as const).map((v) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => setInputs((p) => ({ ...p, fiction: v }))}
                  className={`flex-1 py-2 text-sm font-body rounded border transition-colors ${
                    inputs.fiction === v
                      ? "bg-burgundy text-parchment border-burgundy"
                      : "bg-parchment text-ink border-border hover:border-burgundy"
                  }`}
                >
                  {v === "" ? "Either" : v === "fiction" ? "Fiction" : "Non-fiction"}
                </button>
              ))}
            </div>
          </div>

          {/* Genres */}
          <div>
            <label className="font-body font-600 text-xs uppercase tracking-widest text-muted block mb-3">
              Genres <span className="normal-case font-400">(pick any)</span>
            </label>
            <div className="flex flex-wrap gap-1.5">
              {GENRES.slice(0, 14).map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => toggleGenre(g)}
                  className={`px-3 py-1.5 text-xs font-body rounded-full border transition-colors ${
                    inputs.genres.includes(g)
                      ? "bg-burgundy text-parchment border-burgundy"
                      : "border-border text-muted hover:border-burgundy hover:text-ink"
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>

          {/* Mood */}
          <div>
            <label className="font-body font-600 text-xs uppercase tracking-widest text-muted block mb-3">
              Mood <span className="normal-case font-400">(pick any)</span>
            </label>
            <div className="flex flex-wrap gap-1.5">
              {MOODS.map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => toggleMood(m)}
                  className={`px-3 py-1.5 text-xs font-body rounded-full border transition-colors capitalize ${
                    inputs.moods.includes(m)
                      ? "bg-gold text-charcoal border-gold"
                      : "border-border text-muted hover:border-gold hover:text-ink"
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          {/* Length */}
          <div>
            <label className="font-body font-600 text-xs uppercase tracking-widest text-muted block mb-3">Length</label>
            <div className="flex gap-2">
              {(["", "short", "medium", "long"] as const).map((v) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => setInputs((p) => ({ ...p, length: v }))}
                  className={`flex-1 py-2 text-xs font-body rounded border transition-colors capitalize ${
                    inputs.length === v
                      ? "bg-burgundy text-parchment border-burgundy"
                      : "bg-parchment text-ink border-border hover:border-burgundy"
                  }`}
                >
                  {v || "Any"}
                </button>
              ))}
            </div>
            <div className="flex text-[10px] font-body text-stone mt-1 px-1">
              <span className="flex-1"></span>
              <span className="flex-1 text-center">&lt;200 pg</span>
              <span className="flex-1 text-center">200–400</span>
              <span className="flex-1 text-center">400+</span>
            </div>
          </div>

          {/* Difficulty */}
          <div>
            <label className="font-body font-600 text-xs uppercase tracking-widest text-muted block mb-3">Difficulty</label>
            <div className="flex gap-2">
              {(["", "easy", "medium", "hard"] as const).map((v) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => setInputs((p) => ({ ...p, difficulty: v }))}
                  className={`flex-1 py-2 text-xs font-body rounded border transition-colors capitalize ${
                    inputs.difficulty === v
                      ? "bg-burgundy text-parchment border-burgundy"
                      : "bg-parchment text-ink border-border hover:border-burgundy"
                  }`}
                >
                  {v || "Any"}
                </button>
              ))}
            </div>
          </div>

          {/* Era */}
          <div>
            <label className="font-body font-600 text-xs uppercase tracking-widest text-muted block mb-3">Era</label>
            <select
              value={inputs.era}
              onChange={(e) => setInputs((p) => ({ ...p, era: e.target.value as DiscoveryInputs["era"] }))}
              className="w-full bg-card border border-border rounded px-3 py-2 text-sm font-body text-ink focus:outline-none focus:border-burgundy"
            >
              <option value="">Any era</option>
              <option value="ancient">Ancient (pre-500 AD)</option>
              <option value="classical">Classical (500–1900)</option>
              <option value="modern">Modern (1900–2000)</option>
              <option value="contemporary">Contemporary (2000+)</option>
            </select>
          </div>

          {/* Similar to */}
          <div>
            <label className="font-body font-600 text-xs uppercase tracking-widest text-muted block mb-3">Similar to a book I love</label>
            <select
              value={inputs.similarTo}
              onChange={(e) => setInputs((p) => ({ ...p, similarTo: e.target.value }))}
              className="w-full bg-card border border-border rounded px-3 py-2 text-sm font-body text-ink focus:outline-none focus:border-burgundy"
            >
              <option value="">Select a book...</option>
              {BOOKS.sort((a, b) => a.title.localeCompare(b.title)).map((b) => (
                <option key={b.id} value={b.slug}>{b.title} — {b.author}</option>
              ))}
            </select>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              className="flex-1 bg-burgundy text-parchment py-3 rounded font-body font-600 text-sm hover:bg-burgundy-light transition-colors"
            >
              Find My Books
            </button>
            {searched && (
              <button
                type="button"
                onClick={handleReset}
                className="px-4 py-3 border border-border rounded font-body text-sm text-muted hover:text-ink hover:border-ink transition-colors"
              >
                Reset
              </button>
            )}
          </div>
        </form>

        {/* Results */}
        <div className="lg:col-span-3">
          {!searched ? (
            <div className="h-full flex items-center justify-center">
              <div className="text-center text-muted">
                <div className="font-display text-6xl mb-4">📖</div>
                <p className="font-display text-xl font-400 text-ink mb-2">Your recommendations will appear here</p>
                <p className="font-body text-sm">Fill in any combination of fields and click "Find My Books"</p>
              </div>
            </div>
          ) : results.length === 0 ? (
            <div className="h-full flex items-center justify-center">
              <div className="text-center text-muted">
                <p className="font-display text-xl font-400 text-ink mb-2">No matches found</p>
                <p className="font-body text-sm">Try broadening your filters — fewer genres, any length, any era.</p>
              </div>
            </div>
          ) : (
            <div>
              <p className="text-muted text-sm font-body mb-5">{results.length} books matched your preferences</p>
              <div className="space-y-3">
                {results.map((result, i) => (
                  <ResultCard key={result.book.id} result={result} rank={i + 1} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
