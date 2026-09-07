export type ShelfName = "want-to-read" | "reading" | "completed" | "favorites";

export interface TrackerEntry {
  bookId: string;
  shelf: ShelfName;
  addedAt: string;
  progress?: number; // 0-100 for "reading"
}

export interface ReadingGoal {
  yearly: number;
  year: number;
}

const STORAGE_KEY = "librarium_tracker";
const GOAL_KEY = "librarium_goal";

function loadEntries(): TrackerEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveEntries(entries: TrackerEntry[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

export function getEntries(): TrackerEntry[] {
  return loadEntries();
}

export function getEntriesByShelf(shelf: ShelfName): TrackerEntry[] {
  return loadEntries().filter((e) => e.shelf === shelf);
}

export function getEntryForBook(bookId: string): TrackerEntry | undefined {
  return loadEntries().find((e) => e.bookId === bookId);
}

export function addToShelf(bookId: string, shelf: ShelfName): void {
  const entries = loadEntries().filter((e) => e.bookId !== bookId);
  entries.push({ bookId, shelf, addedAt: new Date().toISOString() });
  saveEntries(entries);
}

export function removeFromTracker(bookId: string): void {
  saveEntries(loadEntries().filter((e) => e.bookId !== bookId));
}

export function updateProgress(bookId: string, progress: number): void {
  const entries = loadEntries();
  const idx = entries.findIndex((e) => e.bookId === bookId);
  if (idx >= 0) {
    entries[idx].progress = Math.max(0, Math.min(100, progress));
    saveEntries(entries);
  }
}

export function getReadingGoal(): ReadingGoal {
  try {
    const raw = localStorage.getItem(GOAL_KEY);
    return raw ? JSON.parse(raw) : { yearly: 12, year: new Date().getFullYear() };
  } catch {
    return { yearly: 12, year: new Date().getFullYear() };
  }
}

export function setReadingGoal(goal: ReadingGoal): void {
  localStorage.setItem(GOAL_KEY, JSON.stringify(goal));
}

export function getCompletedThisYear(): number {
  const thisYear = new Date().getFullYear();
  return loadEntries().filter((e) => {
    if (e.shelf !== "completed") return false;
    return new Date(e.addedAt).getFullYear() === thisYear;
  }).length;
}

export const SHELF_LABELS: Record<ShelfName, string> = {
  "want-to-read": "Want to Read",
  reading: "Currently Reading",
  completed: "Completed",
  favorites: "Favorites",
};

export const SHELF_ORDER: ShelfName[] = ["reading", "want-to-read", "completed", "favorites"];
