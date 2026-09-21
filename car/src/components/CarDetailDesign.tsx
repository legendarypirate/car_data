"use client";

import Image from "next/image";
import type { Car } from "@/data/cars";
import { formatPrice } from "@/lib/format";
import { mergeCarTabs } from "@/lib/car-tabs";

const featureIcons = [
  <svg key="1" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M3 14h18l-2-5H5l-2 5z" />
    <circle cx="7.5" cy="16.5" r="1.5" />
    <circle cx="16.5" cy="16.5" r="1.5" />
  </svg>,
  <svg key="2" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <circle cx="12" cy="12" r="4" />
    <path d="M12 3v2M12 19v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M3 12h2M19 12h2" />
  </svg>,
  <svg key="3" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M4 16h16l-2-6H8L4 16z" />
    <path d="M8 10c2-4 6-5 10-3" />
  </svg>,
  <svg key="4" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M4 16h16v3H4z" />
    <path d="M6 16c1-5 4-8 6-8s5 3 6 8" />
  </svg>,
  <svg key="5" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M5 15h14l-1.5-5H6.5L5 15z" />
    <circle cx="8" cy="16.5" r="1.4" />
    <circle cx="16" cy="16.5" r="1.4" />
  </svg>,
];

export function CarDetailDesign({ car }: { car: Car }) {
  const tabs = mergeCarTabs(car.tabs);
  const photos = Array.from(new Set([car.image, ...(car.gallery || [])].filter(Boolean)));
  const features = (tabs.design.features || []).filter((item) => item.title || item.sub);

  return (
    <div className="space-y-12">
      <div className="grid items-end gap-8 lg:grid-cols-12">
        <div className="lg:col-span-6">
          <h2 className="text-[42px] font-bold tracking-tight text-[#0f172a]">
            {tabs.design.title || "Дизайн"}
          </h2>
          {tabs.design.subtitle && (
            <p className="mt-1 text-[18px] text-[#64748b]">{tabs.design.subtitle}</p>
          )}
        </div>
        {car.description && (
          <p className="text-[14px] leading-7 text-[#64748b] lg:col-span-6 lg:text-right">
            {car.description}
          </p>
        )}
      </div>

      {photos.length > 0 && (
        <div className="grid gap-4 lg:grid-cols-12">
          <div className="relative min-h-[280px] overflow-hidden rounded-[22px] bg-[#eef2f6] lg:col-span-8 lg:min-h-[460px]">
            <Image
              src={photos[0]}
              alt={car.name}
              fill
              sizes="(min-width: 1024px) 66vw, 100vw"
              className="object-cover object-[60%_center]"
            />
          </div>
          {photos.length > 1 && (
            <div className="grid gap-4 lg:col-span-4">
              {photos.slice(1, 3).map((src) => (
                <div key={src} className="relative min-h-[170px] overflow-hidden rounded-[22px] bg-[#eef2f6] lg:min-h-[222px]">
                  <Image src={src} alt={car.name} fill sizes="(min-width: 1024px) 33vw, 100vw" className="object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {features.length > 0 && (
        <div className="grid gap-8 border-t border-[#eef2f6] pt-8 sm:grid-cols-2 lg:grid-cols-5">
          {features.map((item, index) => (
            <div key={`${item.title}-${index}`} className="text-center sm:text-left">
              <div className="mx-auto mb-3 text-[#0f172a] sm:mx-0">
                {featureIcons[index % featureIcons.length]}
              </div>
              <p className="text-[14px] font-semibold text-[#0f172a]">{item.title}</p>
              <p className="mt-1 text-[12px] leading-5 text-[#94a3b8]">{item.sub}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function DesignHeroCopy({ car }: { car: Car }) {
  const tabs = mergeCarTabs(car.tabs);
  return (
    <>
      {tabs.design.subtitle && (
        <p className="mt-3 max-w-md text-[16px] leading-7 text-white/80">{tabs.design.subtitle}</p>
      )}
      <p className="mt-5 text-[22px] font-semibold tracking-tight">
        {formatPrice(car.price)}{" "}
        <span className="text-[13px] font-normal text-white/55">~ эхс</span>
      </p>
    </>
  );
}
