// Ikon bintang/sunburst kecil — elemen dekoratif ciri khas tema ini.
// Dipakai di samping heading kartu, atau sebagai hiasan di pojok section.

export default function Sunburst({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      fill="currentColor"
      aria-hidden="true"
    >
      {[0, 45, 90, 135].map((angle) => (
        <rect
          key={angle}
          x="42"
          y="5"
          width="16"
          height="90"
          rx="4"
          transform={`rotate(${angle} 50 50)`}
        />
      ))}
    </svg>
  );
}
