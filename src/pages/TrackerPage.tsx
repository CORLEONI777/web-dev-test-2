import { useState, useEffect } from "react";
import { Link } from "react-router";
import {
  getEntries, getEntriesByShelf, addToShelf, removeFromTracker, updateProgress,
  getReadingGoal, setReadingGoal, getCompletedThisYear,
  SHELF_LABELS, SHELF_ORDER, ShelfName, TrackerEntry,
} from "../lib/tracker";
import { getBookBySlug, BOOKS, Book } from "../data/books";
import StarRating from "../components/StarRating";

function ProgressBar({ value }: { value: number }) {
  return (
    <div className="w-full h-1.5 bg-card-deep rounded-full overflow-hidden">
      <div
        className="h-full progress-bar rounded-full transition-all duration-300"
        style={{ width: `${Math.max(2, value)}%` }}
      />
    </div>
  );
}

function ShelfSection({
  shelf,
  onRefresh,
}: {
  shelf: ShelfName;
  onRefresh: () => void;
}) {
  const entries = getEntriesByShelf(shelf);
  const books = entries
    .map((e) => {
      const book = BOOKS.find((b) => b.id === e.bookId);
      return book ? { entry: e, book } : null;
    })
    .filter(Boolean) as { entry: TrackerEntry; book: Book }[];

  if (books.length === 0) {
    return (
      <div className="py-8 text-center border border-dashed border-border rounded-lg">
        <p className="text-muted font-body text-sm">No books here yet.</p>
        <Link to="/discover" className="text-burgundy font-body text-xs hover:underline mt-1 inline-block">
          Discover books to add →
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-0">
      {books.map(({ entry, book }) => (
        <div key={book.id} className="flex gap-4 py-5 border-b border-border-light last:border-0 items-start">
          <Link to={`/books/${book.slug}`} className="flex-shrink-0">
            <div
              className="w-12 h-16 rounded overflow-hidden"
              style={{ backgroundColor: book.coverBg }}
            >
              <img src={book.cover} alt={book.title} className="w-full h-full object-cover" />
            </div>
          </Link>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <Link to={`/books/${book.slug}`}>
                  <h3 className="font-display font-500 text-ink text-sm leading-tight hover:text-burgundy transition-colors">
                    {book.title}
                  </h3>
                </Link>
                <p className="font-body text-stone text-xs mt-0.5">{book.author}</p>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 flex-shrink-0">
                <select
                  value={entry.shelf}
                  onChange={(e) => {
                    addToShelf(book.id, e.target.value as ShelfName);
                    onRefresh();
                  }}
                  className="text-xs font-body bg-card border border-border rounded px-2 py-1 text-ink focus:outline-none focus:border-burgundy"
                >
                  {SHELF_ORDER.map((s) => (
                    <option key={s} value={s}>{SHELF_LABELS[s]}</option>
                  ))}
                </select>
                <button
                  onClick={() => { removeFromTracker(book.id); onRefresh(); }}
                  className="text-muted hover:text-ink text-xs transition-colors p-1"
                  title="Remove"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <path d="M18 6 6 18M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Progress for "reading" shelf */}
            {entry.shelf === "reading" && (
              <div className="mt-2">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] font-body text-muted">Progress</span>
                  <span className="text-[11px] font-body text-muted">{entry.progress ?? 0}%</span>
                </div>
                <ProgressBar value={entry.progress ?? 0} />
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={entry.progress ?? 0}
                  onChange={(e) => {
                    updateProgress(book.id, Number(e.target.value));
                    onRefresh();
                  }}
                  className="w-full mt-1 accent-burgundy h-0.5"
                />
              </div>
            )}

            <div className="mt-1 flex gap-2 text-[11px] font-body text-stone">
              <span>{book.pages} pages</span>
              <span>·</span>
              <span className="capitalize">{book.length}</span>
              <span>·</span>
              <StarRating rating={book.rating} size="sm" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function TrackerPage() {
  const [tick, setTick] = useState(0);
  const [activeShelf, setActiveShelf] = useState<ShelfName>("reading");
  const [goal, setGoal] = useState(getReadingGoal());
  const [editGoal, setEditGoal] = useState(false);
  const [goalInput, setGoalInput] = useState(goal.yearly.toString());

  const refresh = () => setTick((t) => t + 1);

  useEffect(() => {
    setGoal(getReadingGoal());
  }, [tick]);

  const allEntries = getEntries();
  const completedThisYear = getCompletedThisYear();
  const goalPct = Math.min(100, Math.round((completedThisYear / goal.yearly) * 100));
  const shelfCounts = Object.fromEntries(
    SHELF_ORDER.map((s) => [s, getEntriesByShelf(s).length])
  );

  const handleGoalSave = () => {
    const n = parseInt(goalInput, 10);
    if (n > 0) {
      const updated = { yearly: n, year: new Date().getFullYear() };
      setReadingGoal(updated);
      setGoal(updated);
    }
    setEditGoal(false);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 lg:px-8 py-10">
      {/* Header */}
      <div className="mb-10">
        <h1 className="font-display text-3xl lg:text-4xl font-500 text-ink mb-2">My Shelf</h1>
        <p className="text-muted font-body text-sm">
          {allEntries.length} book{allEntries.length !== 1 ? "s" : ""} tracked · Stored locally, no account needed
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
        {/* Sidebar — goal + shelf nav */}
        <div className="lg:col-span-1">
          <div className="sticky top-20 space-y-6">
            {/* Reading goal */}
            <div className="bg-card border border-border rounded-lg p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-body font-600 text-xs uppercase tracking-widest text-muted">
                  {goal.year} Reading Goal
                </h3>
                <button
                  onClick={() => setEditGoal((v) => !v)}
                  className="text-xs font-body text-burgundy hover:underline"
                >
                  Edit
                </button>
              </div>

              {editGoal ? (
                <div className="flex gap-2">
                  <input
                    type="number"
                    min="1"
                    max="365"
                    value={goalInput}
                    onChange={(e) => setGoalInput(e.target.value)}
                    className="w-full bg-parchment border border-border rounded px-2 py-1 text-sm font-body focus:outline-none focus:border-burgundy"
                  />
                  <button
                    onClick={handleGoalSave}
                    className="text-xs font-body bg-burgundy text-parchment px-3 py-1 rounded hover:bg-burgundy-light transition-colors"
                  >
                    Save
                  </button>
                </div>
              ) : (
                <>
                  <div className="flex items-baseline gap-1 mb-3">
                    <span className="font-display text-3xl font-500 text-ink">{completedThisYear}</span>
                    <span className="text-muted font-body text-sm">/ {goal.yearly} books</span>
                  </div>
                  <ProgressBar value={goalPct} />
                  <p className="text-muted font-body text-xs mt-2">{goalPct}% of your {goal.year} goal</p>
                </>
              )}
            </div>

            {/* Shelf navigation */}
            <nav className="space-y-1">
              {SHELF_ORDER.map((shelf) => (
                <button
                  key={shelf}
                  onClick={() => setActiveShelf(shelf)}
                  className={`w-full flex items-center justify-between px-4 py-2.5 rounded text-sm font-body transition-colors text-left ${
                    activeShelf === shelf
                      ? "bg-burgundy text-parchment"
                      : "text-muted hover:text-ink hover:bg-card"
                  }`}
                >
                  <span>{SHELF_LABELS[shelf]}</span>
                  <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                    activeShelf === shelf ? "bg-parchment/20 text-parchment" : "bg-card text-muted"
                  }`}>
                    {shelfCounts[shelf] ?? 0}
                  </span>
                </button>
              ))}
            </nav>

            {/* Add books CTA */}
            <div className="text-center pt-2">
              <Link
                to="/discover"
                className="text-sm font-body text-burgundy hover:underline"
              >
                + Discover books to add
              </Link>
            </div>
          </div>
        </div>

        {/* Main shelf view */}
        <div className="lg:col-span-3">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display text-xl font-500 text-ink">{SHELF_LABELS[activeShelf]}</h2>
            <span className="text-muted font-body text-sm">{shelfCounts[activeShelf] ?? 0} books</span>
          </div>
          <ShelfSection key={`${activeShelf}-${tick}`} shelf={activeShelf} onRefresh={refresh} />
        </div>
      </div>
    </div>
  );
}
