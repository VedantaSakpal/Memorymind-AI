const Logo = () => (
  <div className="relative flex h-8 w-8 items-center justify-center">
    <svg
      viewBox="0 0 36 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="h-8 w-8 text-[#0C162C] transition-transform duration-300 hover:scale-105"
    >
      <defs>
        <linearGradient id="logoGlobeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0D5B5A" />
          <stop offset="50%" stopColor="#14B8A6" />
          <stop offset="100%" stopColor="#0C162C" />
        </linearGradient>
      </defs>
      {/* Globe / Neural Mesh Sphere */}
      <circle
        cx="18"
        cy="18"
        r="14"
        stroke="#0C162C"
        strokeWidth="2"
      />
      {/* Horizontal grid parallels */}
      <ellipse
        cx="18"
        cy="18"
        rx="14"
        ry="6"
        stroke="#0C162C"
        strokeWidth="1.6"
      />
      <line
        x1="4"
        y1="18"
        x2="32"
        y2="18"
        stroke="#0C162C"
        strokeWidth="1.6"
      />
      {/* Vertical meridian */}
      <ellipse
        cx="18"
        cy="18"
        rx="6"
        ry="14"
        stroke="#0C162C"
        strokeWidth="1.6"
      />
      {/* Center cybernetic pulse dot */}
      <circle cx="18" cy="18" r="2.5" fill="#14B8A6" />
    </svg>
  </div>
);

export default Logo;
