"use client";

import { useEffect, useRef } from "react";

type Tag = "span" | "p" | "h1" | "h2" | "h3" | "div";

export function Editable({
  value,
  onChange,
  className = "",
  as: Tag = "span",
}: {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  as?: Tag;
}) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node || document.activeElement === node) return;
    if (node.innerText !== value) node.innerText = value;
  }, [value]);

  return (
    <Tag
      ref={ref as never}
      contentEditable
      suppressContentEditableWarning
      className={`cursor-text rounded-sm outline-none hover:bg-sky-400/10 focus:bg-sky-400/15 focus:outline-2 focus:outline-offset-2 focus:outline-sky-400 ${className}`}
      onClick={(event) => event.stopPropagation()}
      onBlur={() => {
        const next = ref.current?.innerText ?? "";
        if (next !== value) onChange(next);
      }}
    />
  );
}
