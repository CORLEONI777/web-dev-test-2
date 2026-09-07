/**
 * Fetches and parses plain-text editions from Project Gutenberg into a
 * chapter/paragraph structure the reader UI can page through.
 *
 * IMPORTANT — CORS: Project Gutenberg's file servers don't consistently
 * publish `Access-Control-Allow-Origin` headers, so a direct browser
 * `fetch()` from this static site can be blocked by the browser even
 * though the request itself would succeed from a server. This module
 * tries a few known mirrors and fails gracefully with a clear error the
 * UI can show, rather than silently breaking.
 *
 * The robust long-term fix (see the site's architecture plan) is a small
 * backend proxy — e.g. a Cloudflare Worker — that fetches the text
 * server-side, strips it, and caches the parsed result in R2/KV. That
 * removes the CORS problem entirely and avoids re-fetching/re-parsing the
 * same book on every visit. This client-only version is the fallback for
 * when no such proxy is configured yet.
 */

export interface GutenbergChapter {
  id: string;
  title: string;
  paragraphs: string[];
}

export interface GutenbergBook {
  gutenbergId: string;
  title?: string;
  author?: string;
  chapters: GutenbergChapter[];
}

const bookCache = new Map<string, GutenbergBook>();

/** Pulls the numeric ebook ID out of a gutenberg.org URL, e.g. .../ebooks/1342 -> "1342". */
export function extractGutenbergId(url: string | undefined): string | null {
  if (!url) return null;
  const match = url.match(/(\d{1,7})(?:[/.]|$)/);
  return match ? match[1] : null;
}

function candidateTextUrls(id: string): string[] {
  return [
    `https://www.gutenberg.org/cache/epub/${id}/pg${id}.txt`,
    `https://www.gutenberg.org/files/${id}/${id}-0.txt`,
    `https://www.gutenberg.org/files/${id}/${id}.txt`,
  ];
}

async function fetchRawText(id: string, signal?: AbortSignal): Promise<string> {
  let lastError: unknown = null;
  for (const url of candidateTextUrls(id)) {
    try {
      const res = await fetch(url, { signal });
      if (!res.ok) {
        lastError = new Error(`Gutenberg responded ${res.status} for ${url}`);
        continue;
      }
      return await res.text();
    } catch (err) {
      lastError = err;
    }
  }
  throw lastError instanceof Error
    ? lastError
    : new Error("Could not reach Project Gutenberg.");
}

const START_MARKER = /\*{3}\s*START OF (?:THE|THIS) PROJECT GUTENBERG EBOOK[^\n]*\*{3}/i;
const END_MARKER = /\*{3}\s*END OF (?:THE|THIS) PROJECT GUTENBERG EBOOK[^\n]*\*{3}/i;

function stripBoilerplate(raw: string): string {
  const startMatch = raw.match(START_MARKER);
  const endMatch = raw.match(END_MARKER);
  const start = startMatch ? (startMatch.index ?? 0) + startMatch[0].length : 0;
  const end = endMatch ? endMatch.index ?? raw.length : raw.length;
  return raw.slice(start, end).trim();
}

function extractMeta(raw: string): { title?: string; author?: string } {
  const titleMatch = raw.match(/^Title:\s*(.+)$/m);
  const authorMatch = raw.match(/^Author:\s*(.+)$/m);
  return {
    title: titleMatch?.[1]?.trim(),
    author: authorMatch?.[1]?.trim(),
  };
}

function cleanParagraph(block: string): string {
  return block.replace(/\s*\n\s*/g, " ").replace(/\s{2,}/g, " ").trim();
}

function paragraphsFromText(text: string): string[] {
  return text
    .split(/\n{2,}/)
    .map(cleanParagraph)
    .filter((p) => p.length > 1 && !/^\[.*\]$/.test(p) && !/^-{3,}$/.test(p));
}

const CHAPTER_HEADING = /^[ \t]{0,10}((?:CHAPTER|Chapter|BOOK|Book|PART|Part|VOLUME|Volume)\s+(?:[IVXLCDM]+|\d+)\b.{0,60})$/gm;

function splitIntoChapters(text: string): GutenbergChapter[] {
  const matches = [...text.matchAll(CHAPTER_HEADING)];

  if (matches.length >= 2) {
    const chapters: GutenbergChapter[] = [];
    for (let i = 0; i < matches.length; i++) {
      const match = matches[i];
      const title = match[1].trim();
      const bodyStart = (match.index ?? 0) + match[0].length;
      const bodyEnd = i + 1 < matches.length ? matches[i + 1].index ?? text.length : text.length;
      const paragraphs = paragraphsFromText(text.slice(bodyStart, bodyEnd));
      if (paragraphs.length > 0) {
        chapters.push({ id: `ch-${i}`, title, paragraphs });
      }
    }
    if (chapters.length > 0) return chapters;
  }

  // Fallback: no reliable chapter headings found — chunk into
  // reasonably sized "parts" of roughly 1,800 words each so the reader
  // still gets manageable pages instead of one giant wall of text.
  const allParagraphs = paragraphsFromText(text);
  const chunks: GutenbergChapter[] = [];
  let current: string[] = [];
  let wordCount = 0;
  let partNumber = 1;

  const flush = () => {
    if (current.length === 0) return;
    chunks.push({ id: `part-${partNumber}`, title: `Part ${partNumber}`, paragraphs: current });
    partNumber += 1;
    current = [];
    wordCount = 0;
  };

  for (const paragraph of allParagraphs) {
    current.push(paragraph);
    wordCount += paragraph.split(/\s+/).length;
    if (wordCount >= 1800) flush();
  }
  flush();

  return chunks;
}

export async function loadGutenbergBook(
  gutenbergUrl: string,
  signal?: AbortSignal,
): Promise<GutenbergBook> {
  const id = extractGutenbergId(gutenbergUrl);
  if (!id) {
    throw new Error("This book doesn't have a recognizable Project Gutenberg ID.");
  }

  const cached = bookCache.get(id);
  if (cached) return cached;

  const raw = await fetchRawText(id, signal);
  const meta = extractMeta(raw);
  const body = stripBoilerplate(raw);
  const chapters = splitIntoChapters(body);

  if (chapters.length === 0) {
    throw new Error("Project Gutenberg returned this book, but it couldn't be parsed into readable pages.");
  }

  const book: GutenbergBook = { gutenbergId: id, title: meta.title, author: meta.author, chapters };
  bookCache.set(id, book);
  return book;
}
