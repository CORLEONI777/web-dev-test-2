export interface Collection {
  slug: string;
  title: string;
  description: string;
  bookSlugs: string[];
  coverImage: string;
  coverBg: string;
}

export const COLLECTIONS: Collection[] = [
  {
    slug: "philosophy-books",
    title: "Best Philosophy Books",
    description: "Essential works that wrestle with the deepest questions — how to live, what we can know, and what we owe each other. Curated for both first-time readers and those returning with harder questions.",
    bookSlugs: ["meditations", "the-republic", "mans-search-for-meaning", "the-alchemist"],
    coverImage: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&h=500&fit=crop&auto=format",
    coverBg: "#4A3828",
  },
  {
    slug: "short-books",
    title: "Best Short Books",
    description: "Under 250 pages. These books prove that the length of a novel has nothing to do with the size of its impact. Perfect for readers who want substance without commitment.",
    bookSlugs: ["the-alchemist", "mans-search-for-meaning", "the-great-gatsby", "the-hitchhikers-guide-to-the-galaxy", "foundation"],
    coverImage: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&h=500&fit=crop&auto=format",
    coverBg: "#3A3A5A",
  },
  {
    slug: "books-about-grief",
    title: "Best Books About Grief",
    description: "Books that meet you in the difficult moments — loss, mourning, the long work of continuing. These are not easy books, but they are honest ones.",
    bookSlugs: ["the-road", "mans-search-for-meaning", "a-tale-of-two-cities"],
    coverImage: "https://images.unsplash.com/photo-1475924156734-496f6cac6ec1?w=800&h=500&fit=crop&auto=format",
    coverBg: "#2A2A2A",
  },
  {
    slug: "dystopian-fiction",
    title: "Best Dystopian Fiction",
    description: "These novels imagined nightmare futures that feel, increasingly, like the present. Essential reading for understanding power, freedom, and the fragility of civilization.",
    bookSlugs: ["1984", "brave-new-world", "dune", "the-road"],
    coverImage: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&h=500&fit=crop&auto=format",
    coverBg: "#1A1A2E",
  },
  {
    slug: "fantasy-books",
    title: "Best Fantasy Books",
    description: "The genre at its most serious and imaginative — world-builders who created entire mythologies, political systems, and languages in service of a story.",
    bookSlugs: ["dune", "the-hobbit", "the-name-of-the-wind"],
    coverImage: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=500&fit=crop&auto=format",
    coverBg: "#1E3A1E",
  },
  {
    slug: "books-on-human-behavior",
    title: "Best Books on Human Behavior",
    description: "Why do we do what we do? These books draw on psychology, neuroscience, and behavioral economics to reveal the hidden forces shaping our choices.",
    bookSlugs: ["thinking-fast-and-slow", "atomic-habits", "sapiens"],
    coverImage: "https://images.unsplash.com/photo-1535398089889-dd807df1dfaa?w=800&h=500&fit=crop&auto=format",
    coverBg: "#2A3A5A",
  },
];

export function getCollectionBySlug(slug: string): Collection | undefined {
  return COLLECTIONS.find((c) => c.slug === slug);
}
