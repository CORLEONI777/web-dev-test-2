import { Link } from "react-router";

export default function NotFoundPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-32 text-center">
      <p className="font-display text-8xl font-300 text-border mb-4">404</p>
      <h1 className="font-display text-3xl font-500 text-ink mb-3">Page not found</h1>
      <p className="text-muted font-body leading-relaxed mb-8">
        This page doesn't exist — but there are thousands of great books that do.
      </p>
      <div className="flex justify-center gap-4">
        <Link to="/" className="bg-burgundy text-parchment px-6 py-3 rounded font-body font-500 text-sm hover:bg-burgundy-light transition-colors">
          Go Home
        </Link>
        <Link to="/discover" className="border border-border text-ink px-6 py-3 rounded font-body font-500 text-sm hover:bg-card transition-colors">
          Discover Books
        </Link>
      </div>
    </div>
  );
}
