"use client";

import { Pencil, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

const base =
  "inline-flex size-8 items-center justify-center rounded-lg shadow-[0_2px_8px_rgba(15,23,42,0.08)] transition-transform hover:-translate-y-px";

export function EditAction({
  title = "Засах",
  onClick,
}: {
  title?: string;
  onClick: () => void;
}) {
  return (
    <button type="button" title={title} onClick={onClick} className={cn(base, "bg-white text-[#64748b]")}>
      <Pencil className="size-4" />
    </button>
  );
}

export function DeleteAction({
  title = "Устгах",
  onClick,
}: {
  title?: string;
  onClick: () => void;
}) {
  return (
    <button type="button" title={title} onClick={onClick} className={cn(base, "bg-[#f87171] text-white")}>
      <Trash2 className="size-4" />
    </button>
  );
}

export function SoftAction({
  title,
  onClick,
  children,
}: {
  title: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button type="button" title={title} onClick={onClick} className={cn(base, "bg-white text-[#64748b]")}>
      {children}
    </button>
  );
}
