"use client";

import Image from "next/image";
import { useState } from "react";

export function CarGallery({
  images,
  alt,
  badge,
  badgeColor,
}: {
  images: string[];
  alt: string;
  badge?: string;
  badgeColor?: string;
}) {
  const [active, setActive] = useState(0);

  const badgeBg =
    badgeColor === "green" || badge === "Шинэ"
      ? "bg-[#10b981]"
      : badgeColor === "amber" || badge === "Хит"
      ? "bg-[#d97706]"
      : badgeColor === "slate" || badge === "Агуулахад"
      ? "bg-[#475569]"
      : "bg-[#10b981]";

  return (
    <div className="flex flex-col gap-3">
      {/* Main Image Container */}
      <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl bg-[#0c121d] shadow-md border border-[#e2e8f0]">
        {badge && (
          <div className="absolute left-4 top-4 z-10">
            <span
              className={`inline-block rounded-md ${badgeBg} px-3 py-1 text-[12px] font-bold text-white shadow-sm`}
            >
              {badge}
            </span>
          </div>
        )}

        <Image
          src={images[active] || images[0]}
          alt={alt}
          fill
          priority
          sizes="(min-width: 1024px) 60vw, 100vw"
          className="object-cover transition-all duration-500 ease-out"
        />

        {/* Gallery count indicator */}
        <div className="absolute right-4 bottom-4 z-10 rounded-full bg-black/60 px-3 py-1 text-[11px] font-medium text-white backdrop-blur-sm">
          {active + 1} / {images.length}
        </div>
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-3 sm:grid-cols-5">
          {images.map((src, index) => (
            <button
              key={`${src}-${index}`}
              type="button"
              onClick={() => setActive(index)}
              className={`relative aspect-[16/10] overflow-hidden rounded-xl border-2 transition-all ${
                index === active
                  ? "border-[#0c121d] ring-2 ring-[#0c121d]/20 shadow-sm scale-[1.02]"
                  : "border-transparent opacity-70 hover:opacity-100"
              }`}
            >
              <Image
                src={src}
                alt=""
                fill
                sizes="120px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
