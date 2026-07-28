export function StariaLogo({ light = false }: { light?: boolean }) {
  const bracket = light ? "#ffffff" : "#0B5E3C";
  const wordmark = light ? "#ffffff" : "#1B1B1B";

  return (
    <div className="flex items-center gap-3">
      <svg width="40" height="40" viewBox="0 0 60 60" fill="none">
        <rect x="7" y="7" width="19" height="5" fill={bracket} />
        <rect x="7" y="7" width="5" height="19" fill={bracket} />
        <rect x="34" y="7" width="19" height="5" fill={bracket} />
        <rect x="48" y="7" width="5" height="19" fill={bracket} />
        <rect x="7" y="48" width="19" height="5" fill={bracket} />
        <rect x="7" y="34" width="5" height="19" fill={bracket} />
        <rect x="34" y="48" width="19" height="5" fill={bracket} />
        <rect x="48" y="34" width="5" height="19" fill={bracket} />
        <path
          d="M30 16 L33.2 26.8 L44 30 L33.2 33.2 L30 44 L26.8 33.2 L16 30 L26.8 26.8 Z"
          fill="#D9A11A"
        />
      </svg>
      <span
        className="text-[1.05rem] font-bold tracking-[0.38em]"
        style={{ fontFamily: "'Montserrat', sans-serif", color: wordmark }}
      >
        STARIA
      </span>
    </div>
  );
}
