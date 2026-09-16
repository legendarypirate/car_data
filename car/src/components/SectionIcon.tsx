import type { ReactNode } from "react";

const paths: Record<string, ReactNode> = {
  car: (
    <>
      <path d="M5 17h14" />
      <path d="M7 17V9l2.5-4h5L17 9v8" />
      <circle cx="7.5" cy="17.5" r="1.5" />
      <circle cx="16.5" cy="17.5" r="1.5" />
      <path d="M5 12h14" />
    </>
  ),
  users: (
    <>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </>
  ),
  globe: (
    <>
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20" />
      <path d="M12 2a15 15 0 0 1 0 20" />
      <path d="M12 2a15 15 0 0 0 0 20" />
    </>
  ),
  shield: (
    <path d="M12 3 4 6v6c0 5 3.5 8.5 8 9.5 4.5-1 8-4.5 8-9.5V6l-8-3z" />
  ),
  leaf: (
    <path d="M11 21C5 15 4 9 7 5c5-1 11 3 12 10-4 1-8 3-8 6z" />
  ),
  handshake: (
    <>
      <path d="M8 13 5 10l4-4 3 3 3-3 4 4-3 3" />
      <path d="m12 9 3 3" />
      <path d="M4 14l3 3" />
      <path d="M17 14l3 3" />
    </>
  ),
  eye: (
    <>
      <path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z" />
      <circle cx="12" cy="12" r="3" />
    </>
  ),
  cog: (
    <>
      <circle cx="12" cy="12" r="3" />
      <path d="M12 2v3M12 19v3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M2 12h3M19 12h3M4.9 19.1 7 17M17 7l2.1-2.1" />
    </>
  ),
};

export function SectionIcon({
  name,
  className = "h-6 w-6",
}: {
  name?: string;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      {paths[name || ""] || paths.car}
    </svg>
  );
}
