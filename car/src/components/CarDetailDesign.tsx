"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Car } from "@/data/cars";
import { formatPrice } from "@/lib/format";
import { mergeCarTabs } from "@/lib/car-tabs";

const colors = [
  { id: "white", name: "Platinum White Pearl", hex: "#ececec", filter: "none" },
  { id: "silver", name: "Emotional Silver", hex: "#c4c7cc", filter: "grayscale(0.35) brightness(1.04)" },
  { id: "black", name: "Attitude Black", hex: "#161616", filter: "brightness(0.42) contrast(1.15)" },
  { id: "green", name: "Forest Green", hex: "#243f34", filter: "hue-rotate(95deg) saturate(0.55) brightness(0.72)" },
  { id: "gray", name: "Space Gray", hex: "#4b4e54", filter: "grayscale(0.85) brightness(0.68)" },
] as const;

const features = [
  {
    title: "Closed Front Grille",
    sub: "Орчин үеийн цахилгаан загварын илэрхийлэл",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M3 14h18l-2-5H5l-2 5z" />
        <circle cx="7.5" cy="16.5" r="1.5" />
        <circle cx="16.5" cy="16.5" r="1.5" />
        <path d="M7 9h10" />
      </svg>
    ),
  },
  {
    title: "LED Lighting",
    sub: "Илүү тод, илүү аюулгүй",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="12" cy="12" r="4" />
        <path d="M12 3v2M12 19v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M3 12h2M19 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4" />
      </svg>
    ),
  },
  {
    title: "Aerodynamic Body",
    sub: "Салааны эсэргүүцлийг багасгасан бүтэц",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M4 16h16l-2-6H8L4 16z" />
        <path d="M8 10c2-4 6-5 10-3" />
      </svg>
    ),
  },
  {
    title: "Panoramic Roof",
    sub: "Илүү өргөн, илүү чөлөөтэй мэдрэмж",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M4 16h16v3H4z" />
        <path d="M6 16c1-5 4-8 6-8s5 3 6 8" />
        <path d="M12 8v8" />
      </svg>
    ),
  },
  {
    title: "Modern Rear Design",
    sub: "Тод, танигдахуйц арын хэсэг",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M5 15h14l-1.5-5H6.5L5 15z" />
        <path d="M8 10V8h8v2" />
        <circle cx="8" cy="16.5" r="1.4" />
        <circle cx="16" cy="16.5" r="1.4" />
      </svg>
    ),
  },
];

export function CarDetailDesign({ car }: { car: Car }) {
  const tabs = mergeCarTabs(car.tabs);
  const [colorId, setColorId] = useState<(typeof colors)[number]["id"]>("white");
  const [slide, setSlide] = useState(0);
  const shortName = car.name.replace(new RegExp(`^${car.brand}\\s+`, "i"), "");
  const color = colors.find((item) => item.id === colorId) ?? colors[0];
  const featureItems = tabs.design.features.length
    ? tabs.design.features.map((item, index) => ({ ...features[index % features.length], ...item }))
    : features;
  const slides = colors.map((item) => ({
    ...item,
    src: car.image,
  }));
  const current = slides[slide];

  function prev() {
    setSlide((value) => (value === 0 ? slides.length - 1 : value - 1));
  }

  function next() {
    setSlide((value) => (value === slides.length - 1 ? 0 : value + 1));
  }

  return (
    <div className="space-y-12">
      <div className="grid items-end gap-8 lg:grid-cols-12">
        <div className="lg:col-span-6">
          <h2 className="text-[42px] font-bold tracking-tight text-[#0f172a]">Design</h2>
          <p className="mt-1 text-[18px] text-[#64748b]">
            Орчин үеийн, минимал, ирээдүйг илтгэсэн дизайн
          </p>
        </div>
        <p className="lg:col-span-6 lg:text-right text-[14px] leading-7 text-[#64748b]">
          {car.brand} {shortName} нь Minimalism ба Functionality-г хослуулсан
          дизайны философитой. Цэвэр шулуун шугам, аэродинамик хэлбэр нь
          зөвхөн гоо зүй төдийгүй, үр ашигтай байдлыг бий болгодог.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-12">
        <div className="relative min-h-[280px] overflow-hidden rounded-[22px] bg-[#eef2f6] lg:col-span-8 lg:min-h-[460px]">
          <Image
            src={car.image}
            alt={`${car.name} ${color.name}`}
            fill
            sizes="(min-width: 1024px) 66vw, 100vw"
            className="object-cover object-[60%_center]"
            style={{ filter: color.filter }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/45 via-transparent to-transparent" />
          <div className="absolute bottom-8 left-8 text-white">
            <p className="max-w-[130px] text-[22px] font-semibold uppercase leading-6 tracking-[0.12em]">
              Bold electric confident
            </p>
            <p className="mt-3 max-w-[180px] text-[13px] leading-5 text-white/80">
              Шинэ үеийн цэвэр цахилгаан мэдрэмж
            </p>
          </div>
        </div>

        <div className="grid gap-4 lg:col-span-4">
          <div className="relative min-h-[170px] overflow-hidden rounded-[22px] bg-[#eef2f6] lg:min-h-[222px]">
            <Image
              src={car.image}
              alt={`${car.name} rear`}
              fill
              sizes="(min-width: 1024px) 33vw, 100vw"
              className="object-cover object-[88%_40%] scale-125"
              style={{ filter: color.filter }}
            />
          </div>
          <div className="relative min-h-[170px] overflow-hidden rounded-[22px] bg-[#eef2f6] lg:min-h-[222px]">
            <Image
              src={car.image}
              alt={`${car.name} lighting`}
              fill
              sizes="(min-width: 1024px) 33vw, 100vw"
              className="object-cover object-[18%_58%] scale-[1.8]"
              style={{ filter: color.filter }}
            />
          </div>
        </div>
      </div>

      <div className="grid gap-8 border-t border-[#eef2f6] pt-8 sm:grid-cols-2 lg:grid-cols-5">
        {featureItems.map((item) => (
          <div key={item.title} className="text-center sm:text-left">
            <div className="mx-auto mb-3 text-[#0f172a] sm:mx-0">{item.icon}</div>
            <p className="text-[14px] font-semibold text-[#0f172a]">{item.title}</p>
            <p className="mt-1 text-[12px] leading-5 text-[#94a3b8]">{item.sub}</p>
          </div>
        ))}
      </div>

      <div>
        <h3 className="text-[16px] font-semibold text-[#0f172a]">Өнгөний сонголт</h3>
        <div className="mt-4 flex flex-wrap gap-3">
          {colors.map((item) => {
            const selected = item.id === colorId;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setColorId(item.id);
                  setSlide(colors.findIndex((c) => c.id === item.id));
                }}
                className={`flex min-w-[132px] items-center gap-3 rounded-xl border px-3 py-3 text-left transition-colors ${
                  selected
                    ? "border-[#0f172a] bg-white shadow-sm"
                    : "border-[#e8edf3] bg-white hover:border-[#cbd5e1]"
                }`}
              >
                <span
                  className="h-8 w-8 shrink-0 rounded-md border border-black/10"
                  style={{ background: item.hex }}
                />
                <span className="text-[12px] font-medium leading-4 text-[#0f172a]">
                  {item.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <section className="relative overflow-hidden rounded-[28px] bg-[#0b1220]">
        <Image
          src="/cta-scenic.jpg"
          alt=""
          fill
          sizes="100vw"
          className="object-cover opacity-50"
        />
        <div className="absolute inset-0 bg-[#070b12]/35" />
        <div className="relative grid min-h-[320px] items-center gap-6 px-6 py-10 md:min-h-[380px] md:grid-cols-12 md:px-10">
          <div className="relative h-[220px] md:col-span-7 md:h-[280px]">
            <Image
              src={current.src}
              alt={`${car.name} ${current.name}`}
              fill
              sizes="(min-width: 768px) 55vw, 100vw"
              className="object-contain object-left"
              style={{ filter: current.filter }}
            />
          </div>
          <div className="text-white md:col-span-5 md:text-right">
            <h3 className="text-[28px] font-bold leading-tight tracking-tight md:text-[34px]">
              Илүү цэвэр ертөнцийн төлөө хөдөлж байна.
            </h3>
            <p className="mt-4 text-[12px] font-semibold uppercase tracking-[0.22em] text-white/70">
              A cleaner tomorrow
              <br />
              starts today
            </p>
          </div>
        </div>
        <div className="relative flex items-center justify-between px-6 pb-6 md:px-10">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={prev}
              className="grid h-9 w-9 place-items-center rounded-full border border-white/30 text-white hover:bg-white/10"
              aria-label="Өмнөх"
            >
              ‹
            </button>
            <button
              type="button"
              onClick={next}
              className="grid h-9 w-9 place-items-center rounded-full border border-white/30 text-white hover:bg-white/10"
              aria-label="Дараах"
            >
              ›
            </button>
          </div>
          <p className="text-[13px] font-medium text-white/80">
            {String(slide + 1).padStart(2, "0")} / {String(slides.length).padStart(2, "0")}
          </p>
        </div>
      </section>
    </div>
  );
}

export function DesignHeroCopy({ car }: { car: Car }) {
  const tabs = mergeCarTabs(car.tabs);
  return (
    <>
      <p className="mt-3 text-[18px] text-white/90">
        {tabs.overview.heroLine || `${car.bodyLabel || "Цахилгаан SUV"} – Илүү их боломжийн төлөө`}
      </p>
      <p className="mt-4 max-w-md text-[14px] leading-7 text-white/70">
        {tabs.design.subtitle}
      </p>
      <p className="mt-5 text-[22px] font-semibold tracking-tight">
        {formatPrice(car.price)}{" "}
        <span className="text-[13px] font-normal text-white/55">~ эхс</span>
      </p>
      <Link
        href={`/contact?car=${car.slug}`}
        className="mt-6 inline-flex h-11 items-center gap-2 text-[14px] font-medium text-white hover:text-white/80"
      >
        Захиалга өгөх <span>→</span>
      </Link>
    </>
  );
}
