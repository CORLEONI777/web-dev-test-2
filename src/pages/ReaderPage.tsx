import { useEffect, useMemo, useState, useCallback } from "react";
import { useParams, Link } from "react-router";
import { getBookBySlug } from "../data/books";
import { loadGutenbergBook, GutenbergBook } from "../lib/gutenberg";
import {
  READER_THEMES,
  FONT_SIZE_PX,
  ReaderFontSize,
  getReaderPrefs,
  setReaderPrefs,
  getReaderTheme,
  getSavedChapterIndex,
  saveChapterIndex,
} from "../lib/readerPrefs";
import { getEntryForBook, addToShelf, updateProgress } from "../lib/tracker";
import "../styles/reader.css";

type LoadStatus = "loading" | "ready" | "error";

/** Splits a paragraph's first word off so it can get the "lead-in" style seen in the reference design. */
function LeadParagraph({ text }: { text: string }) {
  const spaceIndex = text.indexOf(" ");
  if (spaceIndex === -1) return <>{text}</>;
  const firstWord = text.slice(0, spaceIndex);
  const rest = text.slice(spaceIndex);
  return (
    <>
      <span className="reader-lead-word">{firstWord}</span>
      {rest}
    </>
  );
}

export default function ReaderPage() {
  const { slug } = useParams<{ slug: string }>();
  const book = slug ? getBookBySlug(slug) : undefined;

  const [prefs, setPrefsState] = useState(getReaderPrefs());
  const [gbook, setGbook] = useState<GutenbergBook | null>(null);
  const [status, setStatus] = useState<LoadStatus>("loading");
  const [errorMessage, setErrorMessage] = useState("");
  const [chapterIndex, setChapterIndex] = useState(0);
  const [retryToken, setRetryToken] = useState(0);

  const theme = useMemo(() => getReaderTheme(prefs.themeId), [prefs.themeId]);

  useEffect(() => {
    if (!book?.gutenbergUrl) return;
    const controller = new AbortController();
    setStatus("loading");
    setErrorMessage("");

    loadGutenbergBook(book.gutenbergUrl, controller.signal)
      .then((result) => {
        setGbook(result);
        setStatus("ready");
        const saved = getSavedChapterIndex(book.id);
        setChapterIndex(Math.min(saved, result.chapters.length - 1));
      })
      .catch((err: unknown) => {
        if (controller.signal.aborted) return;
        setStatus("error");
        setErrorMessage(err instanceof Error ? err.message : "Something went wrong loading this book.");
      });

    return () => controller.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [book?.gutenbergUrl, retryToken]);

  const updateChapter = useCallback(
    (index: number) => {
      if (!book || !gbook) return;
      const clamped = Math.max(0, Math.min(index, gbook.chapters.length - 1));
      setChapterIndex(clamped);
      saveChapterIndex(book.id, clamped);
      window.scrollTo({ top: 0, behavior: "smooth" });

      const entry = getEntryForBook(book.id);
      if (entry?.shelf === "reading") {
        const pct = Math.round(((clamped + 1) / gbook.chapters.length) * 100);
        updateProgress(book.id, pct);
      }
    },
    [book, gbook],
  );

  const handleThemeChange = (themeId: string) => {
    const next = { ...prefs, themeId };
    setPrefsState(next);
    setReaderPrefs(next);
  };

  const handleFontSizeChange = (fontSize: ReaderFontSize) => {
    const next = { ...prefs, fontSize };
    setPrefsState(next);
    setReaderPrefs(next);
  };

  const handleStartTracking = () => {
    if (!book) return;
    addToShelf(book.id, "reading");
    if (gbook) updateProgress(book.id, Math.round(((chapterIndex + 1) / gbook.chapters.length) * 100));
  };

  if (!book) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <p className="font-display text-3xl text-muted mb-4">Book not found</p>
        <Link to="/" className="text-burgundy font-body text-sm hover:underline">← Back to home</Link>
      </div>
    );
  }

  if (!book.isPublicDomain || !book.gutenbergUrl) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <p className="font-display text-3xl text-ink mb-4">Not available to read in-app</p>
        <p className="text-muted font-body leading-relaxed mb-8">
          "{book.title}" isn't in the public domain, so we can't show its full text here.
          {book.amazonEbookUrl || book.amazonPaperbackUrl ? " You can buy a copy from the book's page." : ""}
        </p>
        <Link to={`/books/${book.slug}`} className="bg-burgundy text-parchment px-6 py-3 rounded font-body font-500 text-sm hover:bg-burgundy-light transition-colors">
          ← Back to {book.title}
        </Link>
      </div>
    );
  }

  const chapter = gbook?.chapters[chapterIndex];
  const totalChapters = gbook?.chapters.length ?? 0;
  const trackerEntry = getEntryForBook(book.id);
  const fontSizePx = FONT_SIZE_PX[prefs.fontSize];

  const readerShellStyle = {
    "--reader-page-bg": theme.pageBg,
    "--reader-article-bg": theme.articleBg,
    "--reader-text": theme.text,
    "--reader-heading": theme.heading,
    "--reader-margin": theme.margin,
    "--reader-font-size": `${fontSizePx}px`,
  } as React.CSSProperties;

  return (
    <div>
      {/* Toolbar */}
      <div className="sticky top-14 z-40 bg-parchment border-b border-border">
        <div className="max-w-5xl mx-auto px-4 py-3 flex flex-wrap items-center gap-x-6 gap-y-3">
          <Link to={`/books/${book.slug}`} className="text-sm font-body text-muted hover:text-ink transition-colors flex items-center gap-1.5 flex-shrink-0">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m15 18-6-6 6-6" />
            </svg>
            {book.title}
          </Link>

          <div className="flex-1" />

          {/* Background theme picker */}
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-body text-muted uppercase tracking-wide mr-1">Background</span>
            {READER_THEMES.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => handleThemeChange(t.id)}
                title={t.label}
                aria-label={`${t.label} background`}
                aria-pressed={prefs.themeId === t.id}
                className={`w-6 h-6 rounded-full border-2 transition-transform ${
                  prefs.themeId === t.id ? "border-burgundy scale-110" : "border-border-light hover:scale-105"
                }`}
                style={{ backgroundColor: t.swatch }}
              />
            ))}
          </div>

          {/* Font size */}
          <div className="flex items-center gap-1">
            <span className="text-[11px] font-body text-muted uppercase tracking-wide mr-1">Text</span>
            {(["sm", "md", "lg"] as ReaderFontSize[]).map((size) => (
              <button
                key={size}
                type="button"
                onClick={() => handleFontSizeChange(size)}
                aria-pressed={prefs.fontSize === size}
                className={`w-7 h-7 rounded border font-body transition-colors ${
                  prefs.fontSize === size
                    ? "bg-burgundy text-parchment border-burgundy"
                    : "border-border text-muted hover:border-burgundy hover:text-ink"
                }`}
                style={{ fontSize: size === "sm" ? "11px" : size === "md" ? "13px" : "15px" }}
              >
                A
              </button>
            ))}
          </div>
        </div>

        {/* Chapter nav */}
        {status === "ready" && gbook && (
          <div className="max-w-5xl mx-auto px-4 pb-3 flex items-center gap-3">
            <button
              type="button"
              onClick={() => updateChapter(chapterIndex - 1)}
              disabled={chapterIndex === 0}
              className="text-xs font-body px-2 py-1 rounded border border-border text-muted hover:text-ink hover:border-burgundy transition-colors disabled:opacity-30 disabled:pointer-events-none"
            >
              ← Prev
            </button>
            <select
              value={chapterIndex}
              onChange={(e) => updateChapter(Number(e.target.value))}
              className="flex-1 max-w-xs bg-card border border-border rounded px-2 py-1 text-xs font-body text-ink focus:outline-none focus:border-burgundy"
            >
              {gbook.chapters.map((c, i) => (
                <option key={c.id} value={i}>{i + 1}. {c.title}</option>
              ))}
            </select>
            <button
              type="button"
              onClick={() => updateChapter(chapterIndex + 1)}
              disabled={chapterIndex === totalChapters - 1}
              className="text-xs font-body px-2 py-1 rounded border border-border text-muted hover:text-ink hover:border-burgundy transition-colors disabled:opacity-30 disabled:pointer-events-none"
            >
              Next →
            </button>
            {!trackerEntry && (
              <button
                type="button"
                onClick={handleStartTracking}
                className="hidden sm:block text-xs font-body px-3 py-1 rounded bg-burgundy text-parchment hover:bg-burgundy-light transition-colors flex-shrink-0"
              >
                Track my progress
              </button>
            )}
          </div>
        )}
      </div>

      {/* Reading surface */}
      <div className="reader-shell" style={readerShellStyle}>
        {status === "loading" && (
          <div className="reader-article" style={{ minHeight: "60vh" }}>
            <h1>{book.title}</h1>
            <h2>by {book.author}</h2>
            <p className="mt-10 text-center font-body text-sm opacity-70" style={{ textIndent: 0 }}>
              Fetching the full text from Project Gutenberg…
            </p>
          </div>
        )}

        {status === "error" && (
          <div className="reader-article" style={{ minHeight: "60vh" }}>
            <h1>{book.title}</h1>
            <h2>by {book.author}</h2>
            <div className="mt-10 text-center font-body text-sm" style={{ textIndent: 0 }}>
              <p className="mb-4 opacity-80">
                We couldn't load the full text directly into the reader — Project Gutenberg's servers
                sometimes block this kind of request from a browser. {errorMessage && <span className="block mt-1 opacity-60">({errorMessage})</span>}
              </p>
              <div className="flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => setRetryToken((n) => n + 1)}
                  className="bg-burgundy text-parchment px-4 py-2 rounded font-body text-sm hover:bg-burgundy-light transition-colors"
                >
                  Try again
                </button>
                <a
                  href={book.gutenbergUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border border-current px-4 py-2 rounded font-body text-sm hover:opacity-70 transition-opacity"
                >
                  Read on gutenberg.org
                </a>
              </div>
            </div>
          </div>
        )}

        {status === "ready" && gbook && chapter && (
          <div>
            <article className="reader-article">
              <h1>{gbook.title ?? book.title}</h1>
              <h2>by {gbook.author ?? book.author}</h2>
              <h3>
                {chapter.title} · {chapterIndex + 1} of {totalChapters}
              </h3>
              <section className="reader-section" aria-label={chapter.title} data-label={chapter.title}>
                {chapter.paragraphs.map((p, i) => (
                  <p key={i} className={i === 0 ? "reader-no-indent" : undefined}>
                    <LeadParagraph text={p} />
                  </p>
                ))}
              </section>
            </article>

            {/* Up next teaser */}
            {chapterIndex + 1 < totalChapters && (
              <button
                type="button"
                onClick={() => updateChapter(chapterIndex + 1)}
                className="block w-full text-left"
              >
                <article className="reader-article" style={{ marginTop: 0, cursor: "pointer" }}>
                  <h3 style={{ margin: "0 0 1em" }}>Up next — {gbook.chapters[chapterIndex + 1].title}</h3>
                  <div className="reader-teaser">
                    {gbook.chapters[chapterIndex + 1].paragraphs.slice(0, 2).map((p, i) => (
                      <p key={i} className={i === 0 ? "reader-no-indent" : undefined}>{p}</p>
                    ))}
                  </div>
                  <p className="text-center mt-4 font-body text-sm" style={{ textIndent: 0, color: theme.heading }}>
                    Continue reading →
                  </p>
                </article>
              </button>
            )}

            {chapterIndex + 1 === totalChapters && (
              <div className="reader-article text-center" style={{ marginTop: 0 }}>
                <p className="font-body text-sm" style={{ textIndent: 0, opacity: 0.7 }}>
                  You've reached the end — thanks for reading.
                </p>
                <Link
                  to={`/books/${book.slug}`}
                  className="inline-block mt-4 bg-burgundy text-parchment px-5 py-2.5 rounded font-body text-sm hover:bg-burgundy-light transition-colors"
                >
                  Back to book details
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
