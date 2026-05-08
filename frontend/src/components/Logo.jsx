export default function Logo({ size = 32, className = "" }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>

      <svg
        width={size}
        height={size}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >

        <rect x="2" y="2" width="28" height="28" rx="8" fill="url(#brand-gradient)" />

        <rect x="7" y="7" width="18" height="18" rx="5" fill="#0f172a" />

        <rect x="11" y="11" width="10" height="10" rx="3" fill="url(#brand-gradient)" />

        <defs>
          <linearGradient id="brand-gradient" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#10b981" />
            <stop offset="100%" stopColor="#8b5cf6" />
          </linearGradient>
        </defs>
      </svg>

      <span className="font-brand font-semibold text-white tracking-tight" style={{ fontSize: size * 0.6 }}>
        TrackNest
      </span>
    </div>
  );
}