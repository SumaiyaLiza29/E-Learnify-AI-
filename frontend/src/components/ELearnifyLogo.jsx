const ELearnifyLogo = ({ size = 38, variant = "dark" }) => {
  const textColor = variant === "dark" ? "text-white" : "text-slate-900";

  return (
    <div className="flex items-center gap-3 select-none">
      {/* ICON */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 48 48"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="elg" x1="0" y1="0" x2="48" y2="48">
            <stop offset="0%" stopColor="#6366F1" />
            <stop offset="100%" stopColor="#0EA5E9" />
          </linearGradient>
        </defs>

        <rect x="2" y="2" width="44" height="44" rx="12" fill="url(#elg)" />

        {/* Book */}
        <path
          d="M15 17h11c2.5 0 4.5 2 4.5 4.5V32c0-2.5-2-4.5-4.5-4.5H15V17z"
          fill="white"
        />

        {/* Graduation cap */}
        <path
          d="M24 14l9 4.5-9 4.5-9-4.5L24 14z"
          fill="white"
        />
      </svg>

      {/* TEXT */}
      <span
        className={`text-xl font-extrabold tracking-tight ${textColor}`}
      >
        E<span className="text-indigo-400">-</span>Learnify
      </span>
    </div>
  );
};

export default ELearnifyLogo;
