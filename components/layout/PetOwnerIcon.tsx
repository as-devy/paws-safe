type PetOwnerIconProps = {
  className?: string;
};

export default function PetOwnerIcon({
  className = "h-5 w-5",
}: PetOwnerIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      <circle
        cx="8.35"
        cy="7.2"
        r="3.1"
        stroke="currentColor"
        strokeWidth="1.85"
      />
      <path
        d="M3.15 19.9c.2-3.15 2.62-5.35 5.28-5.35 1.2 0 2.3.45 3.16 1.2"
        stroke="currentColor"
        strokeWidth="1.85"
        strokeLinecap="round"
      />
      <g fill="currentColor">
        <ellipse cx="16.95" cy="17.55" rx="3.05" ry="2.7" />
        <ellipse
          cx="13.7"
          cy="14.05"
          rx="1.18"
          ry="1.4"
          transform="rotate(-30 13.7 14.05)"
        />
        <ellipse cx="16.35" cy="12.7" rx="1.15" ry="1.45" />
        <ellipse
          cx="19.15"
          cy="13.2"
          rx="1.15"
          ry="1.4"
          transform="rotate(22 19.15 13.2)"
        />
        <ellipse
          cx="20.75"
          cy="15.55"
          rx="1.08"
          ry="1.28"
          transform="rotate(40 20.75 15.55)"
        />
      </g>
    </svg>
  );
}
