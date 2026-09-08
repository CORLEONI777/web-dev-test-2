export interface ReaderTheme {
  id: string;
  label: string;
  /** Swatch shown in the picker button. */
  swatch: string;
  /** Background behind the page/article (like the body color in a print layout). */
  pageBg: string;
  /** Background of the "paper" the text sits on. */
  articleBg: string;
  text: string;
  heading: string;
  margin: string;
}

export const READER_THEMES: ReaderTheme[] = [
  {
    id: "parchment",
    label: "Parchment",
    swatch: "#F2F2EF",
    pageBg: "#333333",
    articleBg: "#F2F2EF",
    text: "#2A2A2A",
    heading: "#082048",
    margin: "rgba(5, 47, 4, 0.73)",
  },
  {
    id: "sepia",
    label: "Sepia",
    swatch: "#F4ECD8",
    pageBg: "#3A2F24",
    articleBg: "#F4ECD8",
    text: "#5B4636",
    heading: "#5B4636",
    margin: "rgba(91, 70, 54, 0.6)",
  },
  {
    id: "white",
    label: "Bright White",
    swatch: "#FFFFFF",
    pageBg: "#E4E4E4",
    articleBg: "#FFFFFF",
    text: "#1A1A1A",
    heading: "#1A1510",
    margin: "rgba(26, 21, 16, 0.55)",
  },
  {
    id: "soft-gray",
    label: "Soft Gray",
    swatch: "#E9E6DF",
    pageBg: "#C9C5BB",
    articleBg: "#E9E6DF",
    text: "#2C2C2C",
    heading: "#3A3226",
    margin: "rgba(58, 50, 38, 0.55)",
  },
  {
    id: "night",
    label: "Night",
    swatch: "#1C1C1C",
    pageBg: "#000000",
    articleBg: "#1C1C1C",
    text: "#D8D3C8",
    heading: "#D4A84B",
    margin: "rgba(212, 168, 75, 0.55)",
  },
];

export type ReaderFontSize = "sm" | "md" | "lg";

export const FONT_SIZE_PX: Record<ReaderFontSize, number> = {
  sm: 15,
  md: 17,
  lg: 19,
};

export interface ReaderPrefs {
  themeId: string;
  fontSize: ReaderFontSize;
}

const PREFS_KEY = "bookshaven_reader_prefs";
const DEFAULT_PREFS: ReaderPrefs = { themeId: "parchment", fontSize: "md" };

export function getReaderPrefs(): ReaderPrefs {
  try {
    const raw = localStorage.getItem(PREFS_KEY);
    if (!raw) return DEFAULT_PREFS;
    const parsed = JSON.parse(raw);
    return {
      themeId: typeof parsed.themeId === "string" ? parsed.themeId : DEFAULT_PREFS.themeId,
      fontSize: ["sm", "md", "lg"].includes(parsed.fontSize) ? parsed.fontSize : DEFAULT_PREFS.fontSize,
    };
  } catch {
    return DEFAULT_PREFS;
  }
}

export function setReaderPrefs(prefs: ReaderPrefs): void {
  localStorage.setItem(PREFS_KEY, JSON.stringify(prefs));
}

export function getReaderTheme(themeId: string): ReaderTheme {
  return READER_THEMES.find((t) => t.id === themeId) ?? READER_THEMES[0];
}

const PROGRESS_KEY_PREFIX = "bookshaven_reader_progress:";

export function getSavedChapterIndex(bookId: string): number {
  const raw = localStorage.getItem(PROGRESS_KEY_PREFIX + bookId);
  const n = raw ? parseInt(raw, 10) : 0;
  return Number.isFinite(n) && n >= 0 ? n : 0;
}

export function saveChapterIndex(bookId: string, index: number): void {
  localStorage.setItem(PROGRESS_KEY_PREFIX + bookId, String(index));
}
