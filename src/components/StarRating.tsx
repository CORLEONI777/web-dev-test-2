interface StarRatingProps {
  rating: number;
  size?: "sm" | "md";
}

export default function StarRating({ rating, size = "sm" }: StarRatingProps) {
  const full = Math.floor(rating);
  const half = rating - full >= 0.25 && rating - full < 0.75;
  const sizeClass = size === "sm" ? "text-sm" : "text-base";

  return (
    <span className={`inline-flex items-center gap-0.5 ${sizeClass}`}>
      {Array.from({ length: 5 }, (_, i) => {
        if (i < full) return <span key={i} className="star-filled">★</span>;
        if (i === full && half) return <span key={i} className="star-filled opacity-60">★</span>;
        return <span key={i} className="star-empty">★</span>;
      })}
      <span className="ml-1 text-stone font-body text-xs tabular-nums">{rating.toFixed(1)}</span>
    </span>
  );
}
