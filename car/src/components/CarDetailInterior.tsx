"use client";

import { useState } from "react";
import Image from "next/image";
import type { Car } from "@/data/cars";
import { mergeCarTabs } from "@/lib/car-tabs";

const featureIcons = [
  <svg key="1" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
    <path d="M14 4v10a4 4 0 0 1-8 0V4" />
    <path d="M4 12h2M18 9h2M10 2v2" />
  </svg>,
  <svg key="2" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4" />
  </svg>,
  <svg key="3" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
    <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z" />
  </svg>,
  <svg key="4" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
    <circle cx="9" cy="7" r="3" />
    <path d="M3 20c.8-3.4 3.2-5 6-5s5.2 1.6 6 5" />
  </svg>,
];

export function interiorHeroSrc(car: Car) {
  const tabs = mergeCarTabs(car.tabs);
  return tabs.interior.heroImage || car.image;
}

export function CarDetailInterior({ car }: { car: Car }) {
  const tabs = mergeCarTabs(car.tabs);
  const [lightbox, setLightbox] = useState<string | null>(null);
  const shortName = car.name.replace(new RegExp(`^${car.brand}\\s+`, "i"), "");
  const features = (tabs.interior.features || []).filter((item) => item.title || item.sub);
  const details = (tabs.interior.details || [])
    .filter((item) => item.title || item.sub || item.image)
    .map((item) => ({
      src: item.image || car.image,
      title: item.title,
      sub: item.sub,
    }));
  const heroSrc = interiorHeroSrc(car);
  const sidePhotos = details.slice(0, 2);

  return (
    <div className="space-y-10">
      <div className="grid items-start gap-10 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#94a3b8]">
            {tabs.interior.label || "INTERIOR"}
          </p>
          <h2 className="mt-2 max-w-lg text-[36px] font-bold leading-[1.15] tracking-tight text-[#0f172a] md:text-[42px]">
            {tabs.interior.title}
          </h2>
          {tabs.interior.subtitle && (
            <p className="mt-4 max-w-xl text-[15px] leading-7 text-[#64748b]">{tabs.interior.subtitle}</p>
          )}
        </div>
        {features.length > 0 && (
          <div className="grid gap-x-8 gap-y-5 sm:grid-cols-2 lg:col-span-5">
            {features.map((item, index) => (
              <div key={`${item.title}-${index}`} className="flex items-start gap-3">
                <span className="mt-0.5 text-[#0f172a]">{featureIcons[index % featureIcons.length]}</span>
                <div>
                  <p className="text-[14px] font-semibold text-[#0f172a]">{item.title}</p>
                  <p className="mt-0.5 text-[12px] text-[#94a3b8]">{item.sub}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {heroSrc && (
        <div className="grid gap-4 lg:grid-cols-12">
          <div className="relative min-h-[320px] overflow-hidden rounded-[22px] lg:col-span-7 lg:min-h-[520px]">
            <Image src={heroSrc} alt={`${car.name} interior`} fill sizes="(min-width: 1024px) 58vw, 100vw" className="object-cover" />
          </div>
          {sidePhotos.length > 0 && (
            <div className="grid gap-4 lg:col-span-5">
              {sidePhotos.map((item) => (
                <div key={item.title} className="relative overflow-hidden rounded-[22px]">
                  <div className="relative aspect-[16/9] lg:aspect-auto lg:h-[252px]">
                    <Image src={item.src} alt={item.title} fill sizes="(min-width: 1024px) 40vw, 100vw" className="object-cover" />
                  </div>
                  <div className="flex items-start justify-between gap-3 px-1 pt-3">
                    <div>
                      <p className="text-[15px] font-semibold text-[#0f172a]">{item.title}</p>
                      <p className="mt-0.5 text-[12px] text-[#94a3b8]">{item.sub}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setLightbox(item.src)}
                      className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-[#e2e8f0] text-lg leading-none text-[#0f172a] hover:bg-[#f8fafc]"
                      aria-label="Томруулах"
                    >
                      +
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {details.length > 2 && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {details.slice(2).map((item) => (
            <button key={item.title} type="button" onClick={() => setLightbox(item.src)} className="text-left">
              <div className="relative aspect-[16/10] overflow-hidden rounded-[18px]">
                <Image src={item.src} alt={item.title} fill sizes="(min-width: 1024px) 25vw, 50vw" className="object-cover" />
              </div>
              <p className="mt-3 text-[15px] font-semibold text-[#0f172a]">{item.title}</p>
              <p className="mt-0.5 text-[12px] leading-5 text-[#94a3b8]">{item.sub}</p>
            </button>
          ))}
        </div>
      )}

      <section className="relative overflow-hidden rounded-[28px] bg-[#070b12] px-7 py-10 text-white md:px-12 md:py-12">
        <div className="relative z-10 flex max-w-lg flex-col justify-center">
          <h3 className="text-[32px] font-bold leading-tight tracking-tight md:text-[36px]">
            {tabs.interior.title || shortName}
          </h3>
          <p className="mt-3 text-[14px] text-white/70">
            {tabs.interior.subtitle || `${car.brand} ${shortName}`}
          </p>
        </div>
      </section>

      {lightbox && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/80 p-6" onClick={() => setLightbox(null)}>
          <div className="relative aspect-[16/10] w-full max-w-4xl overflow-hidden rounded-2xl">
            <Image src={lightbox} alt="" fill className="object-cover" sizes="90vw" />
          </div>
        </div>
      )}
    </div>
  );
}
