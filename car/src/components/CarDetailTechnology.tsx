"use client";

import Image from "next/image";
import Link from "next/link";
import type { Car } from "@/data/cars";
import { mergeCarTabs } from "@/lib/car-tabs";

const highlightIcons = [
  <svg key="1" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
    <rect x="7" y="7" width="10" height="10" rx="1.5" />
    <path d="M7 10H4M7 14H4M20 10h-3M20 14h-3" />
  </svg>,
  <svg key="2" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
    <rect x="3" y="4" width="18" height="13" rx="2" />
    <path d="M8 21h8M12 17v4" />
  </svg>,
  <svg key="3" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
    <rect x="3" y="7" width="16" height="10" rx="2" />
    <path d="M19 10h2v4h-2" />
  </svg>,
  <svg key="4" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
    <path d="M5 17h-1a2 2 0 0 1-2-2v-3l2-5h7l2 5h4a2 2 0 0 1 2 2v3h-1" />
    <circle cx="7.5" cy="17.5" r="1.5" />
    <circle cx="16.5" cy="17.5" r="1.5" />
  </svg>,
];

export function CarDetailTechnology({ car }: { car: Car }) {
  const tabs = mergeCarTabs(car.tabs);
  const highlights = (tabs.technology.highlights || []).filter((item) => item.title || item.sub);
  const stats = [
    { value: car.rangeLabel || (car.rangeKm ? `${car.rangeKm} км` : ""), label: "Нэг цэнэгээр" },
    { value: car.batteryKwh ? `${car.batteryKwh} кВт·ц` : "", label: "Батарейн багтаамж" },
    { value: car.chargeMinutes ? `${car.chargeMinutes} мин` : "", label: "Хурдан цэнэглэлт" },
  ].filter((item) => item.value);

  return (
    <div className="space-y-8">
      <div className="grid items-start gap-10 lg:grid-cols-12">
        <div className="lg:col-span-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#94a3b8]">
            {tabs.technology.label || "TECHNOLOGY"}
          </p>
          <h2 className="mt-2 max-w-md text-[32px] font-bold leading-[1.15] tracking-tight text-[#0f172a] md:text-[40px]">
            {tabs.technology.heading || tabs.technology.title}
          </h2>
          {(tabs.technology.body || tabs.technology.subtitle) && (
            <p className="mt-4 max-w-xl text-[15px] leading-7 text-[#64748b]">
              {tabs.technology.body || tabs.technology.subtitle}
            </p>
          )}
        </div>

        {highlights.length > 0 && (
          <div className="grid gap-x-8 gap-y-6 sm:grid-cols-2 lg:col-span-6">
            {highlights.map((item, index) => (
              <div
                key={`${item.title}-${index}`}
                className="flex items-start gap-3.5 rounded-2xl border border-[#eef2f6] bg-white px-4 py-4 shadow-[0_8px_24px_rgba(15,23,42,0.04)]"
              >
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-[#f8fafc] text-[#0f172a]">
                  {highlightIcons[index % highlightIcons.length]}
                </span>
                <span>
                  <span className="block text-[14px] font-semibold leading-snug text-[#0f172a]">{item.title}</span>
                  <span className="mt-1 block text-[12px] text-[#94a3b8]">{item.sub}</span>
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {stats.length > 0 && (
        <section className="rounded-[28px] border border-[#eef2f6] bg-white p-7 shadow-[0_8px_24px_rgba(15,23,42,0.04)] md:p-8">
          <div className="grid gap-6 lg:grid-cols-2">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#94a3b8]">ҮЗҮҮЛЭЛТ</p>
              <h3 className="mt-3 text-[26px] font-bold leading-tight tracking-tight text-[#0f172a]">
                {tabs.technology.title}
              </h3>
              <div className="mt-8 grid grid-cols-3 gap-3">
                {stats.map((item) => (
                  <div key={item.label}>
                    <p className="text-[26px] font-bold tracking-tight text-[#0f172a] md:text-[30px]">{item.value}</p>
                    <p className="mt-1 text-[11px] leading-4 text-[#94a3b8]">{item.label}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative min-h-[220px] overflow-hidden rounded-2xl bg-[#0b1220]">
              {car.image && (
                <Image src={car.image} alt={car.name} fill className="object-cover opacity-80" />
              )}
            </div>
          </div>
        </section>
      )}

      <section className="relative overflow-hidden rounded-[28px] px-7 py-12 text-white md:px-12 md:py-16">
        <Image src={car.image || "/cta-scenic.jpg"} alt="" fill sizes="100vw" className="object-cover" />
        <div className="absolute inset-0 bg-[#0b1220]/55" />
        <div className="relative z-10 flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
          <div>
            <h3 className="max-w-md text-[32px] font-bold leading-tight tracking-tight md:text-[36px]">
              {tabs.technology.title}
            </h3>
            {tabs.technology.subtitle && (
              <p className="mt-3 text-[15px] text-white/80">{tabs.technology.subtitle}</p>
            )}
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href={`/contact?car=${car.slug}`}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-white px-5 text-[13px] font-semibold text-[#0f172a] hover:bg-white/90"
            >
              Захиалга өгөх →
            </Link>
            <Link
              href={`/contact?car=${car.slug}&type=testdrive`}
              className="inline-flex h-11 items-center justify-center rounded-xl border border-white/30 bg-[#0b1220]/40 px-5 text-[13px] font-medium text-white hover:bg-[#0b1220]/60"
            >
              Тест драйв захиалах
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
