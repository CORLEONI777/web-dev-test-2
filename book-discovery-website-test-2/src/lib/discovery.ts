import { BOOKS, Book } from "../data/books";

export interface DiscoveryInputs {
  genres: string[];
  moods: string[];
  length: "short" | "medium" | "long" | "";
  difficulty: "easy" | "medium" | "hard" | "";
  era: "ancient" | "classical" | "modern" | "contemporary" | "";
  similarTo: string;
  fiction: "fiction" | "non-fiction" | "";
  language: string;
}

export interface DiscoveryResult {
  book: Book;
  score: number;
  matchReasons: string[];
  explanation: string;
}

const FICTION_GENRES = ["Fiction", "Fantasy", "Science Fiction", "Classic", "Historical Fiction", "Mystery", "Romance", "Thriller", "Adventure", "Dystopia", "Magical Realism", "Literary Fiction", "Comedy", "Satire", "Epic Poetry"];
const NONFICTION_GENRES = ["Non-Fiction", "Philosophy", "Memoir", "Self-Help", "Psychology", "History", "Science"];

function isFiction(book: Book): boolean {
  return book.genres.some((g) => FICTION_GENRES.includes(g));
}

function isNonFiction(book: Book): boolean {
  return book.genres.some((g) => NONFICTION_GENRES.includes(g));
}

function scoreBook(book: Book, inputs: DiscoveryInputs, similarBook?: Book): { score: number; reasons: string[] } {
  let score = 0;
  const reasons: string[] = [];

  // Genre match — highest weight
  const matchedGenres = inputs.genres.filter((g) => book.genres.includes(g));
  if (matchedGenres.length > 0) {
    score += matchedGenres.length * 30;
    reasons.push(`Genre: ${matchedGenres.join(", ")}`);
  }

  // Mood match
  const matchedMoods = inputs.moods.filter((m) => book.mood.includes(m));
  if (matchedMoods.length > 0) {
    score += matchedMoods.length * 20;
    reasons.push(`Mood: ${matchedMoods.join(", ")}`);
  }

  // Length match
  if (inputs.length && book.length === inputs.length) {
    score += 15;
    reasons.push(`Length: ${inputs.length}`);
  }

  // Difficulty match
  if (inputs.difficulty && book.difficulty === inputs.difficulty) {
    score += 15;
    reasons.push(`Difficulty: ${inputs.difficulty}`);
  }

  // Era match
  if (inputs.era && book.era === inputs.era) {
    score += 10;
    reasons.push(`Era: ${inputs.era}`);
  }

  // Fiction/non-fiction
  if (inputs.fiction === "fiction" && isFiction(book)) {
    score += 10;
  } else if (inputs.fiction === "non-fiction" && isNonFiction(book)) {
    score += 10;
  }

  // Similar book matching
  if (similarBook) {
    const sharedGenres = similarBook.genres.filter((g) => book.genres.includes(g));
    if (sharedGenres.length > 0) {
      score += sharedGenres.length * 25;
      reasons.push(`Similar to "${similarBook.title}": shared genre`);
    }
    if (similarBook.authorSlug === book.authorSlug) {
      score += 20;
      reasons.push(`Same author as "${similarBook.title}"`);
    }
    if (similarBook.era === book.era) {
      score += 5;
    }
    const similarBook_ratingBand = Math.floor(similarBook.rating);
    const book_ratingBand = Math.floor(book.rating);
    if (Math.abs(similarBook_ratingBand - book_ratingBand) <= 1) {
      score += 5;
    }
  }

  // Rating bonus (normalize to 0-10)
  score += (book.rating - 4) * 10;

  return { score, reasons };
}

function buildExplanation(reasons: string[], book: Book, similarBook?: Book): string {
  if (reasons.length === 0) return `"${book.title}" matches your reading preferences.`;

  const parts: string[] = [];

  const genreReason = reasons.find((r) => r.startsWith("Genre:"));
  const moodReason = reasons.find((r) => r.startsWith("Mood:"));
  const lengthReason = reasons.find((r) => r.startsWith("Length:"));
  const difficultyReason = reasons.find((r) => r.startsWith("Difficulty:"));
  const similarReason = reasons.find((r) => r.startsWith("Similar to"));

  if (similarReason) parts.push(similarReason);
  if (genreReason) parts.push(genreReason);
  if (moodReason) parts.push(moodReason);
  if (lengthReason) parts.push(`${lengthReason.replace("Length: ", "")} read`);
  if (difficultyReason) parts.push(`${difficultyReason.replace("Difficulty: ", "")} difficulty`);

  return parts.join(" · ");
}

export function discoverBooks(inputs: DiscoveryInputs): DiscoveryResult[] {
  const hasAnyInput =
    inputs.genres.length > 0 ||
    inputs.moods.length > 0 ||
    inputs.length ||
    inputs.difficulty ||
    inputs.era ||
    inputs.similarTo ||
    inputs.fiction;

  if (!hasAnyInput) return [];

  const similarBook = inputs.similarTo
    ? BOOKS.find((b) => b.slug === inputs.similarTo)
    : undefined;

  return BOOKS.map((book) => {
    const { score, reasons } = scoreBook(book, inputs, similarBook);
    return {
      book,
      score,
      matchReasons: reasons,
      explanation: buildExplanation(reasons, book, similarBook),
    };
  })
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 10);
}

export function getSimilarBooks(book: Book, limit = 4): DiscoveryResult[] {
  return BOOKS.filter((b) => b.id !== book.id)
    .map((candidate) => {
      const sharedGenres = book.genres.filter((g) => candidate.genres.includes(g));
      const sharedMoods = book.mood.filter((m) => candidate.mood.includes(m));
      const sharedTags = book.tags.filter((t) => candidate.tags.includes(t));
      const sameAuthor = book.authorSlug === candidate.authorSlug;
      const sameEra = book.era === candidate.era;
      const similarRating = Math.abs(book.rating - candidate.rating) <= 0.5;

      let score = 0;
      const reasons: string[] = [];

      if (sameAuthor) {
        score += 40;
        reasons.push(`Same author`);
      }
      if (sharedGenres.length > 0) {
        score += sharedGenres.length * 25;
        reasons.push(`Same genre: ${sharedGenres.slice(0, 2).join(", ")}`);
      }
      if (sharedMoods.length > 0) {
        score += sharedMoods.length * 10;
        reasons.push(`Similar mood`);
      }
      if (sharedTags.length > 0) {
        score += sharedTags.length * 5;
      }
      if (sameEra) {
        score += 8;
        reasons.push(`Same era`);
      }
      if (similarRating) {
        score += 5;
      }
      if (candidate.length === book.length) {
        score += 5;
        reasons.push(`Similar length`);
      }

      return {
        book: candidate,
        score,
        matchReasons: reasons,
        explanation: reasons.slice(0, 2).join(" · "),
      };
    })
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}
