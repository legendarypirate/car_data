import type { CarStatus } from "@/data/cars";
import { statusCopy } from "@/lib/format";

const tones: Record<CarStatus, string> = {
  "in-stock": "bg-brand/10 text-brand",
  "in-transit": "bg-canvas text-ink",
  order: "bg-accent/12 text-accent",
};

export function StatusBadge({
  status,
  className = "",
}: {
  status: CarStatus;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center rounded-md px-2 py-1 text-[11px] font-semibold uppercase tracking-wide ${tones[status]} ${className}`}
    >
      {statusCopy[status].label}
    </span>
  );
}
