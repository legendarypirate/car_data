"use client";

import type { Brand, Car } from "@/lib/types";
import type { CmsSection, FooterCms, HeaderCms } from "@/lib/cms";
import { PublicFooter, PublicHeader, PublicPage } from "./public-site";

export function BrowserFrame({
  url,
  badge,
  hint,
  children,
}: {
  url: string;
  badge: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-[0_20px_60px_rgba(12,18,29,0.18)] ring-1 ring-black/10">
      <div className="flex items-center gap-2 border-b bg-[#f3f4f6] px-4 py-2">
        <span className="size-2.5 rounded-full bg-[#ff5f57]" />
        <span className="size-2.5 rounded-full bg-[#febc2e]" />
        <span className="size-2.5 rounded-full bg-[#28c840]" />
        <div className="ml-3 flex-1 rounded-full bg-white px-4 py-1 text-center text-[12px] text-[#6b7280] ring-1 ring-black/5">
          {url}
        </div>
        <span className="rounded-full bg-white px-2 py-0.5 text-[11px] text-[#6b7280] ring-1 ring-black/5">
          {badge}
        </span>
      </div>
      {hint ? (
        <div className="border-b bg-[#0c121d] px-4 py-1.5 text-[11px] text-white/70">
          {hint}
        </div>
      ) : null}
      {children}
    </div>
  );
}

export function PageCanvas({
  header,
  footer,
  sections,
  cars,
  brands,
  slug,
  selectedId,
  chromeEditable,
  onSelect,
  onPatchSection,
  onHeaderChange,
  onFooterChange,
}: {
  header: HeaderCms;
  footer: FooterCms;
  sections: CmsSection[];
  cars: Car[];
  brands?: Brand[];
  slug: string;
  selectedId: string | null;
  chromeEditable?: boolean;
  onSelect: (id: string) => void;
  onPatchSection: (id: string, patch: Partial<CmsSection>) => void;
  onHeaderChange?: (header: HeaderCms) => void;
  onFooterChange?: (footer: FooterCms) => void;
}) {
  const path = slug === "home" ? "/" : `/${slug}`;

  return (
    <BrowserFrame
      url={`localhost:4000${path}`}
      badge={slug === "home" ? "Нүүр" : slug}
      hint="Текстийг дарж засна. Зургийг дарж солино. Машин, брэндийн CRUD өгөгдөл энд засахгүй."
    >
      <PublicPage
        header={header}
        footer={footer}
        sections={sections}
        cars={cars}
        brands={brands}
        activeHref={path}
        selectedId={selectedId}
        editable
        chromeEditable={chromeEditable}
        onSelect={onSelect}
        onPatchSection={onPatchSection}
        onHeaderChange={onHeaderChange}
        onFooterChange={onFooterChange}
      />
    </BrowserFrame>
  );
}

export function ChromeCanvas({
  mode,
  header,
  footer,
  onHeaderChange,
  onFooterChange,
}: {
  mode: "header" | "footer";
  header: HeaderCms;
  footer: FooterCms;
  onHeaderChange: (header: HeaderCms) => void;
  onFooterChange: (footer: FooterCms) => void;
}) {
  return (
    <BrowserFrame
      url="localhost:4000"
      badge={mode === "header" ? "Толгой" : "Хөл"}
      hint="Текстийг дарж засна. Холбоосын хаягийг доорх жагсаалтаас солино."
    >
      {mode === "header" ? (
        <PublicHeader header={header} activeHref="/" editable onChange={onHeaderChange} />
      ) : (
        <PublicFooter footer={footer} editable onChange={onFooterChange} />
      )}
    </BrowserFrame>
  );
}
