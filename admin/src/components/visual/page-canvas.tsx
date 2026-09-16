"use client";

import type { Car } from "@/lib/types";
import type { CmsSection, FooterCms, HeaderCms } from "@/lib/cms";
import { PublicPage } from "./public-site";

export function PageCanvas({
  header,
  footer,
  sections,
  cars,
  slug,
  selectedId,
  onSelect,
  onPatchSection,
}: {
  header: HeaderCms;
  footer: FooterCms;
  sections: CmsSection[];
  cars: Car[];
  slug: string;
  selectedId: string | null;
  onSelect: (id: string) => void;
  onPatchSection: (id: string, patch: Partial<CmsSection>) => void;
}) {
  const path = slug === "home" ? "/" : `/${slug}`;

  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-[0_20px_60px_rgba(12,18,29,0.18)] ring-1 ring-black/10">
      <div className="flex items-center gap-2 border-b bg-[#f3f4f6] px-4 py-2">
        <span className="size-2.5 rounded-full bg-[#ff5f57]" />
        <span className="size-2.5 rounded-full bg-[#febc2e]" />
        <span className="size-2.5 rounded-full bg-[#28c840]" />
        <div className="ml-3 flex-1 rounded-full bg-white px-4 py-1 text-center text-[12px] text-[#6b7280] ring-1 ring-black/5">
          localhost:4000{path}
        </div>
      </div>
      <PublicPage
        header={header}
        footer={footer}
        sections={sections}
        cars={cars}
        activeHref={path}
        selectedId={selectedId}
        editable
        onSelect={onSelect}
        onPatchSection={onPatchSection}
      />
    </div>
  );
}
