"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { apiPath } from "@/lib/api-url";
import type { FooterCms, HeaderCms } from "@/lib/cms";

const fallback: HeaderCms = {
  brand: "NDA AUTO",
  tagline: "DRIVE A BETTER TOMORROW",
  links: [
    { href: "/", label: "Нүүр" },
    { href: "/inventory", label: "Машинууд" },
    { href: "/brands", label: "Брэндүүд" },
    { href: "/about", label: "Бидний тухай" },
    { href: "/services", label: "Үйлчилгээ" },
  ],
  ctaLabel: "Холбоо барих",
  ctaHref: "/contact",
  showSearch: true,
  langPrimary: "MN",
  langSecondary: "EN",
};

export function Header({ data }: { data?: HeaderCms | null }) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [header, setHeader] = useState<HeaderCms>(data || fallback);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");

  useEffect(() => {
    fetch(apiPath("/api/cms/chrome"))
      .then((response) => (response.ok ? response.json() : null))
      .then((json: { header?: HeaderCms; footer?: FooterCms } | null) => {
        if (json?.header) setHeader(json.header);
      })
      .catch(() => undefined);
  }, []);

  useEffect(() => {
    setSearchOpen(false);
    if (pathname === "/inventory") {
      setQuery(searchParams.get("q") ?? "");
    }
  }, [pathname, searchParams]);

  useEffect(() => {
    if (!searchOpen) return;
    inputRef.current?.focus();

    function onPointerDown(event: MouseEvent) {
      if (!searchRef.current?.contains(event.target as Node)) {
        setSearchOpen(false);
      }
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setSearchOpen(false);
    }

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [searchOpen]);

  function submitSearch(event?: FormEvent) {
    event?.preventDefault();
    const q = query.trim();
    router.push(q ? `/inventory?q=${encodeURIComponent(q)}` : "/inventory");
    setSearchOpen(false);
  }

  return (
    <header className="sticky top-0 z-40 bg-[#0c121d] backdrop-blur-md border-b border-white/5">
      <div className="mx-auto flex h-[72px] max-w-[1400px] items-center justify-between gap-4 px-6">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="flex flex-col">
            <span className="text-[20px] font-extrabold tracking-tight text-white leading-tight font-sans">
              {header.brand}
            </span>
            <span className="text-[8px] font-semibold tracking-[0.25em] text-white/45 uppercase leading-tight">
              {header.tagline}
            </span>
          </div>
        </Link>

        <nav className="hidden lg:flex items-center gap-1">
          {header.links.map((link) => {
            const isActive =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);
            return (
              <Link
                key={link.label}
                href={link.href}
                className={`relative px-4 py-2 text-[14px] font-medium transition-colors rounded-md ${
                  isActive
                    ? "text-white font-semibold after:absolute after:bottom-0 after:left-4 after:right-4 after:h-[2px] after:bg-white"
                    : "text-white/70 hover:text-white hover:bg-white/5"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-4">
          {header.showSearch && (
            <div ref={searchRef} className="relative">
              {searchOpen ? (
                <form
                  onSubmit={submitSearch}
                  className="flex items-center gap-2 rounded-xl border border-white/15 bg-[#151c2b] p-1.5"
                >
                  <input
                    ref={inputRef}
                    type="search"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Машин хайх..."
                    className="h-8 w-36 bg-transparent px-2 text-[13px] text-white outline-none placeholder:text-white/40 sm:w-48"
                    aria-label="Машин хайх"
                  />
                  <button
                    type="submit"
                    className="inline-flex h-8 shrink-0 items-center rounded-lg bg-white px-3 text-[12px] font-semibold text-[#0c121d] hover:bg-white/90"
                  >
                    Хайх
                  </button>
                  <button
                    type="button"
                    onClick={() => setSearchOpen(false)}
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-white/60 hover:bg-white/10 hover:text-white"
                    aria-label="Хаах"
                  >
                    ×
                  </button>
                </form>
              ) : (
                <button
                  type="button"
                  onClick={() => setSearchOpen(true)}
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-white/70 transition-colors hover:bg-white/10 hover:text-white"
                  aria-label="Хайх"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8" />
                    <path d="m21 21-4.3-4.3" />
                  </svg>
                </button>
              )}
            </div>
          )}

          {header.ctaLabel && header.ctaHref && (
            <Link
              href={header.ctaHref}
              className="inline-flex h-10 items-center gap-2 rounded-xl bg-white px-5 text-[13px] font-semibold text-[#0c121d] shadow-sm transition-all hover:bg-white/90"
            >
              {header.ctaLabel}
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </Link>
          )}

          <div className="text-[12px] font-medium text-white/60">
            <span className="text-white font-semibold cursor-pointer">{header.langPrimary}</span>
            <span className="mx-1.5 opacity-40">|</span>
            <span className="cursor-pointer hover:text-white transition-colors">{header.langSecondary}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
