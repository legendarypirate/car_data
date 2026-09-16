"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Car } from "@/data/cars";
import { mergeCarTabs } from "@/lib/car-tabs";

const photos = {
  cockpit:
    "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=2000&q=80",
  seats:
    "https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=1400&q=80",
  rear:
    "https://images.unsplash.com/photo-1485291571150-772bcfc10da5?auto=format&fit=crop&w=1400&q=80",
  sunroof:
    "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1200&q=80",
  ambient:
    "https://images.unsplash.com/photo-1542362567-b07e54358753?auto=format&fit=crop&w=1200&q=80",
  storage:
    "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&w=1200&q=80",
  vents:
    "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=1200&q=80",
};

const features = [
  {
    title: "Өргөн, тав тухтай суудал",
    sub: "Урт аялалд ч тухтай",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
        <path d="M14 4v10a4 4 0 0 1-8 0V4" />
        <path d="M4 12h2M18 9h2M10 2v2" />
      </svg>
    ),
  },
  {
    title: "Агаарлаг, илүү орон зай",
    sub: "Панорам дээвэр",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
      </svg>
    ),
  },
  {
    title: "Байгаль ээлтэй материал",
    sub: "Дээд зэрэглэлийн чөдөр",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
        <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z" />
        <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
      </svg>
    ),
  },
  {
    title: "Жолоочид зохион байгуулалт",
    sub: "Бүх функц гар хүрэх зайнд",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
        <circle cx="9" cy="7" r="3" />
        <circle cx="16" cy="8" r="2.4" />
        <path d="M3 20c.8-3.4 3.2-5 6-5s5.2 1.6 6 5M13 15.5c1.6-.4 3.2.2 4 1.5.4.7.7 1.6.8 2.5" />
      </svg>
    ),
  },
];

const details = [
  {
    src: photos.sunroof,
    title: "Панорам дээвэр",
    sub: "Илүү гэрэл, илүү чөлөөтэй мэдрэмж",
  },
  {
    src: photos.ambient,
    title: "Орчны гэрэлтүүлэг",
    sub: "Аялал илүү тав тухтай болгоно",
  },
  {
    src: photos.storage,
    title: "Ухаалаг хадгалах орон зай",
    sub: "Утасны цэнэглэгч, слот зориулалтын хадгалах хайрцаг",
  },
  {
    src: photos.vents,
    title: "Арын суудлын агааржуулалт",
    sub: "Бүх зорчигчод тав тухтай орчин",
  },
];

export function CarDetailInterior({
  car,
}: {
  car: Car;
}) {
  const tabs = mergeCarTabs(car.tabs);
  const [lightbox, setLightbox] = useState<string | null>(null);
  const shortName = car.name.replace(new RegExp(`^${car.brand}\\s+`, "i"), "");
  const featureItems = tabs.interior.features.map((item, index) => ({
    ...features[index % features.length],
    ...item,
  }));
  const detailItems = tabs.interior.details.length
    ? tabs.interior.details.map((item, index) => ({
        src: item.image || details[index % details.length]?.src || photos.sunroof,
        title: item.title,
        sub: item.sub,
      }))
    : details;
  const heroSrc = tabs.interior.heroImage || photos.cockpit;

  return (
    <div className="space-y-10">
      <div className="grid items-start gap-10 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#94a3b8]">
            INTERIOR
          </p>
          <h2 className="mt-2 max-w-lg text-[36px] font-bold leading-[1.15] tracking-tight text-[#0f172a] md:text-[42px]">
            {tabs.interior.title}
          </h2>
          <p className="mt-4 max-w-xl text-[15px] leading-7 text-[#64748b]">
            {tabs.interior.subtitle}
          </p>
        </div>
        <div className="grid gap-x-8 gap-y-5 sm:grid-cols-2 lg:col-span-5">
          {featureItems.map((item) => (
            <div key={item.title} className="flex items-start gap-3">
              <span className="mt-0.5 text-[#0f172a]">{item.icon}</span>
              <div>
                <p className="text-[14px] font-semibold text-[#0f172a]">{item.title}</p>
                <p className="mt-0.5 text-[12px] text-[#94a3b8]">{item.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-12">
        <div className="relative min-h-[320px] overflow-hidden rounded-[22px] lg:col-span-7 lg:min-h-[520px]">
          <Image
            src={heroSrc}
            alt={`${car.name} cockpit`}
            fill
            sizes="(min-width: 1024px) 58vw, 100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
          <p className="absolute bottom-6 left-6 max-w-[140px] text-[13px] font-semibold uppercase leading-5 tracking-[0.18em] text-white">
            A more comfortable tomorrow
          </p>
        </div>

        <div className="grid gap-4 lg:col-span-5">
          {[
            {
              src: photos.seats,
              title: "Эргономик суудал",
              sub: "Дулаацуулалт тохиргоо, шүргэн тохируулга",
            },
            {
              src: photos.rear,
              title: "Арын суудлын орон зай",
              sub: "Гар бүрээ залгах, илүү тухтай",
            },
          ].map((item) => (
            <div key={item.title} className="relative overflow-hidden rounded-[22px]">
              <div className="relative aspect-[16/9] lg:aspect-auto lg:h-[252px]">
                <Image
                  src={item.src}
                  alt={item.title}
                  fill
                  sizes="(min-width: 1024px) 40vw, 100vw"
                  className="object-cover"
                />
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
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {detailItems.map((item) => (
          <button
            key={item.title}
            type="button"
            onClick={() => setLightbox(item.src)}
            className="text-left"
          >
            <div className="relative aspect-[16/10] overflow-hidden rounded-[18px]">
              <Image
                src={item.src}
                alt={item.title}
                fill
                sizes="(min-width: 1024px) 25vw, 50vw"
                className="object-cover"
              />
            </div>
            <p className="mt-3 text-[15px] font-semibold text-[#0f172a]">{item.title}</p>
            <p className="mt-0.5 text-[12px] leading-5 text-[#94a3b8]">{item.sub}</p>
          </button>
        ))}
      </div>

      <section className="relative overflow-hidden rounded-[28px] bg-[#070b12] px-7 py-10 text-white md:px-12 md:py-12">
        <div className="relative z-10 flex max-w-lg flex-col justify-center">
          <h3 className="text-[32px] font-bold leading-tight tracking-tight md:text-[36px]">
            Дараагийн түвшний аяллын туршлага
          </h3>
          <p className="mt-3 text-[14px] text-white/70">
            {car.brand} {shortName} – Илүү их боломжийн төлөө.
          </p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <Link
              href={`/contact?car=${car.slug}`}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-white px-5 text-[13px] font-semibold text-[#0f172a] hover:bg-white/90"
            >
              Захиалга өгөх <span>→</span>
            </Link>
            <Link
              href={`/contact?car=${car.slug}&type=testdrive`}
              className="inline-flex h-11 items-center justify-center rounded-xl border border-white/20 px-5 text-[13px] font-medium text-white hover:bg-white/10"
            >
              Тест драйв захиалах
            </Link>
          </div>
        </div>
        <div className="pointer-events-none absolute inset-y-0 right-[-4%] hidden w-[58%] md:block">
          <Image
            src={car.image}
            alt={car.name}
            fill
            sizes="50vw"
            className="object-contain object-right"
          />
        </div>
      </section>

      {lightbox && (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-black/80 p-6"
          onClick={() => setLightbox(null)}
        >
          <div className="relative aspect-[16/10] w-full max-w-4xl overflow-hidden rounded-2xl">
            <Image src={lightbox} alt="" fill className="object-cover" sizes="90vw" />
          </div>
        </div>
      )}
    </div>
  );
}

export const interiorHeroImage = photos.cockpit;
