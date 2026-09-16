"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { type Car } from "@/data/cars";
import { BrandLogo } from "@/components/BrandLogo";
import { CarCard } from "@/components/CarCard";
import { CarDetailTechnology } from "@/components/CarDetailTechnology";
import { CarDetailInterior, interiorHeroImage } from "@/components/CarDetailInterior";
import { CarDetailDesign, DesignHeroCopy } from "@/components/CarDetailDesign";
import { CarDetailOverview, OverviewHeroCopy } from "@/components/CarDetailOverview";
import { mergeCarTabs, TAB_IDS, type TabId } from "@/lib/car-tabs";

type TabKey = TabId;

export function CarDetailTabs({ car, similar }: { car: Car; similar: Car[] }) {
  const tabConfig = mergeCarTabs(car.tabs);
  const tabs = TAB_IDS.filter((id) => tabConfig[id].visible).map((id) => ({
    id,
    label: tabConfig[id].label,
  }));
  const firstTab = (tabs[0]?.id || "overview") as TabKey;
  const [activeTab, setActiveTab] = useState<TabKey>(firstTab);
  const [galleryFilter, setGalleryFilter] = useState("all");
  const [specVariant, setSpecVariant] = useState("Premium AWD");
  const [activeVideoModal, setActiveVideoModal] = useState<string | null>(null);
  const currentTab = tabs.some((tab) => tab.id === activeTab) ? activeTab : firstTab;
  const interiorHero = tabConfig.interior.heroImage || interiorHeroImage;

  const galleryItems = (
    tabConfig.gallery.items.length
      ? tabConfig.gallery.items
      : (car.gallery?.length ? car.gallery : [car.image]).map((src) => ({
          image: src,
          tag: "Экстерьер",
          category: "exterior",
          caption: car.name,
        }))
  ).map((item) => ({
    src: item.image || car.image,
    tag: item.tag,
    category: item.category,
    caption: item.caption || car.name,
  }));

  const filteredGallery =
    galleryFilter === "all"
      ? galleryItems
      : galleryItems.filter((item) => item.category === galleryFilter);

  // Tab Header Sub-title
  const headerInfo = {
    title: tabConfig[currentTab].title,
    desc: tabConfig[currentTab].subtitle,
  };
  const shortName = car.name.replace(new RegExp(`^${car.brand}\\s+`, "i"), "");

  return (
    <div className="w-full bg-white">
      <section className="relative overflow-hidden bg-[#0b1220] text-white">
        <div className="absolute inset-0 z-0">
          <Image
            src={currentTab === "interior" ? interiorHero : car.image}
            alt={car.name}
            fill
            priority
            sizes="100vw"
            className={
              currentTab === "interior"
                ? "object-cover object-center"
                : "object-cover object-[78%_center]"
            }
          />
          <div
            className={
              currentTab === "interior"
                ? "absolute inset-0 bg-gradient-to-r from-black/70 via-black/35 to-black/20"
                : "absolute inset-0 bg-gradient-to-r from-[#0b1220] via-[#0b1220]/78 to-[#0b1220]/10"
            }
          />
        </div>

        <div
          className={`relative z-10 mx-auto flex max-w-[1400px] items-center justify-between gap-8 px-6 ${
            currentTab === "interior"
              ? "min-h-[420px] py-16 md:min-h-[520px]"
              : currentTab === "design" || currentTab === "overview"
                ? "min-h-[380px] py-16 md:min-h-[440px]"
                : "min-h-[300px] py-14 md:min-h-[360px] md:py-16"
          }`}
        >
          <div>
            <BrandLogo brand={car.brand} theme="light" />
            <h1 className="mt-3 text-5xl font-bold tracking-tight text-white md:text-6xl">
              {shortName}
            </h1>
            {currentTab === "interior" ? (
              <>
                <p className="mt-3 max-w-md text-[16px] text-white/80">
                  {car.bodyLabel || "Цахилгаан SUV"} – Илүү их боломжийн төлөө.
                </p>
                <div className="mt-7 flex flex-wrap items-center gap-3">
                  <Link
                    href={`/contact?car=${car.slug}`}
                    className="inline-flex h-11 items-center gap-2 rounded-xl bg-white px-5 text-[13px] font-semibold text-[#0f172a] hover:bg-white/90"
                  >
                    Захиалга өгөх <span>→</span>
                  </Link>
                  <button
                    type="button"
                    onClick={() => setActiveVideoModal(car.name)}
                    className="inline-flex h-11 items-center gap-2 rounded-xl px-2 text-[13px] font-medium text-white hover:text-white/80"
                  >
                    <span className="grid h-9 w-9 place-items-center rounded-full border border-white/40">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                        <polygon points="8 5 20 12 8 19 8 5" />
                      </svg>
                    </span>
                    Видео үзэх
                  </button>
                </div>
              </>
            ) : currentTab === "design" ? (
              <DesignHeroCopy car={car} />
            ) : currentTab === "overview" ? (
              <OverviewHeroCopy car={car} />
            ) : (
              <>
                <h2 className="mt-2 text-[28px] font-semibold text-white/95 md:text-[32px]">
                  {headerInfo.title}
                </h2>
                <p className="mt-2 max-w-md text-[15px] text-white/70">
                  {headerInfo.desc}
                </p>
              </>
            )}
          </div>

          <div className="hidden flex-col items-end text-right md:flex">
            <span className="text-[11px] font-semibold uppercase tracking-[0.32em] text-white/80">
              CLEAN
            </span>
            <span className="mt-1 text-[11px] font-semibold uppercase tracking-[0.32em] text-white/80">
              SMART
            </span>
            <span className="mt-1 text-[11px] font-semibold uppercase tracking-[0.32em] text-white/80">
              TOGETHER
            </span>
          </div>
        </div>
      </section>

      <div className="sticky top-[72px] z-30 border-b border-[#e8edf3] bg-white/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-4 overflow-x-auto px-6 py-3">
          <div className="flex min-w-max items-center gap-1">
            {tabs.map((tab) => {
              const isActive = currentTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as TabKey)}
                  className={`relative rounded-lg px-4 py-2 text-[14px] transition-colors ${
                    isActive
                      ? "bg-[#0b1220] font-semibold text-white"
                      : "text-[#64748b] hover:text-[#0f172a]"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          <Link
            href={`/contact?car=${car.slug}&type=testdrive`}
            className="hidden h-10 shrink-0 items-center gap-2 rounded-xl bg-[#0b1220] px-4 text-[13px] font-semibold text-white hover:bg-[#1e293b] sm:inline-flex"
          >
            Тест драйв захиалах <span>→</span>
          </Link>
        </div>
      </div>

      {/* Main Tab Content Container */}
      <div className="mx-auto max-w-[1400px] px-6 py-12">
        {currentTab === "overview" && (
          <CarDetailOverview
            car={car}
            onOpenTab={(tab) => setActiveTab(tab)}
          />
        )}
        {currentTab === "technology" && <CarDetailTechnology car={car} />}
        {currentTab === "interior" && <CarDetailInterior car={car} />}
        {currentTab === "design" && <CarDetailDesign car={car} />}


        {/* ============================================================== */}
        {/* TAB: ҮЗҮҮЛЭЛТ (SPECIFICATIONS) */}
        {/* ============================================================== */}
        {currentTab === "specs" && (
          <div className="space-y-10">
            {/* Top Specs Header & Variant Selector */}
            <div className="rounded-2xl border border-[#e2e8f0] bg-white p-6 lg:p-8 shadow-sm">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#f1f5f9] pb-6">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#64748b]">
                    ТЕХНИКИЙН ҮЗҮҮЛЭЛТ
                  </span>
                  <h2 className="mt-1 text-2xl lg:text-3xl font-extrabold text-ink">
                    {car.name}
                  </h2>
                  <p className="mt-1 text-[13px] text-[#64748b]">
                    {tabConfig.specs.intro}
                  </p>
                </div>

                {/* Variant Selector */}
                <div>
                  <label className="block text-[11px] font-semibold text-[#64748b] mb-1">
                    Хувилбар сонгох
                  </label>
                  <select
                    value={specVariant}
                    onChange={(e) => setSpecVariant(e.target.value)}
                    className="rounded-lg border border-[#e2e8f0] bg-white px-3.5 py-2 text-[13px] font-bold text-ink outline-none cursor-pointer"
                  >
                    <option value="Standard FWD">Standard FWD</option>
                    <option value="Premium AWD">Premium AWD</option>
                    <option value="Performance AWD">Performance AWD</option>
                  </select>
                </div>
              </div>

              {/* 4 Metric Badges */}
              <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f1f5f9] text-ink">
                    ⚡
                  </div>
                  <div>
                    <span className="text-xl font-extrabold text-ink font-mono block">
                      {car.rangeLabel || `${car.rangeKm} км`}
                    </span>
                    <span className="text-[11px] text-[#64748b]">
                      WLTP явалтын цэнэг
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f1f5f9] text-ink">
                    🏎️
                  </div>
                  <div>
                    <span className="text-xl font-extrabold text-ink font-mono block">
                      160 км/ц
                    </span>
                    <span className="text-[11px] text-[#64748b]">
                      Хамгийн их хурд
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f1f5f9] text-ink">
                    🔋
                  </div>
                  <div>
                    <span className="text-xl font-extrabold text-ink font-mono block">
                      {car.batteryKwh || "66.7"} кВт·ц
                    </span>
                    <span className="text-[11px] text-[#64748b]">
                      Батарейн багтаамж
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f1f5f9] text-ink">
                    ⏱️
                  </div>
                  <div>
                    <span className="text-xl font-extrabold text-ink font-mono block">
                      30 мин
                    </span>
                    <span className="text-[11px] text-[#64748b]">
                      10% – 80% хурдан цэнэглэлт
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* 2-Column Specs & Dimensional Diagram */}
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 items-start">
              {/* Left Column Tables */}
              <div className="space-y-8">
                {/* 1. Ерөнхий үзүүлэлт */}
                <div className="rounded-2xl border border-[#e2e8f0] bg-white p-6 shadow-sm">
                  <h3 className="text-[16px] font-bold text-ink mb-4 border-b border-[#f1f5f9] pb-3">
                    Ерөнхий үзүүлэлт
                  </h3>
                  <div className="space-y-3 text-[13px]">
                    <div className="flex justify-between py-1 border-b border-[#f8fafc]">
                      <span className="text-[#64748b]">Хувилбар</span>
                      <span className="font-bold text-ink">Standard / Premium / AWD</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-[#f8fafc]">
                      <span className="text-[#64748b]">Хөдөлгүүрийн төрөл</span>
                      <span className="font-bold text-ink">Бүрэн цахилгаан (BEV)</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-[#f8fafc]">
                      <span className="text-[#64748b]">Хөтлөгч</span>
                      <span className="font-bold text-ink">Урд хөтлөгч / Бүх дугуйн хөтлөгч (AWD)</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-[#f8fafc]">
                      <span className="text-[#64748b]">Суудлын тоо</span>
                      <span className="font-bold text-ink">5</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-[#f8fafc]">
                      <span className="text-[#64748b]">Хаалганы тоо</span>
                      <span className="font-bold text-ink">5</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-[#f8fafc]">
                      <span className="text-[#64748b]">Баталгаат хугацаа</span>
                      <span className="font-bold text-ink">8 жил / 160,000 км (Батерей)</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-[#64748b]">Үйлдвэрлэсэн улс</span>
                      <span className="font-bold text-ink">Хятад ({car.brand})</span>
                    </div>
                  </div>
                </div>

                {/* 2. Хэмжээ, жин */}
                <div className="rounded-2xl border border-[#e2e8f0] bg-white p-6 shadow-sm">
                  <h3 className="text-[16px] font-bold text-ink mb-4 border-b border-[#f1f5f9] pb-3">
                    Хэмжээ, жин
                  </h3>
                  <div className="space-y-3 text-[13px]">
                    <div className="flex justify-between py-1 border-b border-[#f8fafc]">
                      <span className="text-[#64748b]">Нийт урт</span>
                      <span className="font-bold text-ink">4,600 мм</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-[#f8fafc]">
                      <span className="text-[#64748b]">Нийт өргөн</span>
                      <span className="font-bold text-ink">1,875 мм</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-[#f8fafc]">
                      <span className="text-[#64748b]">Нийт өндөр</span>
                      <span className="font-bold text-ink">1,645 мм</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-[#f8fafc]">
                      <span className="text-[#64748b]">Тэнхлэг хоорондын зай</span>
                      <span className="font-bold text-ink">2,765 мм</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-[#f8fafc]">
                      <span className="text-[#64748b]">Замын өндөр (Клиренс)</span>
                      <span className="font-bold text-ink">180 мм</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-[#64748b]">Жин (сул)</span>
                      <span className="font-bold text-ink">1,920 – 2,095 кг</span>
                    </div>
                  </div>
                </div>

                {/* 3. Гүйцэтгэл */}
                <div className="rounded-2xl border border-[#e2e8f0] bg-white p-6 shadow-sm">
                  <h3 className="text-[16px] font-bold text-ink mb-4 border-b border-[#f1f5f9] pb-3">
                    Гүйцэтгэл
                  </h3>
                  <div className="space-y-3 text-[13px]">
                    <div className="flex justify-between py-1 border-b border-[#f8fafc]">
                      <span className="text-[#64748b]">Хамгийн их хүч (Мотор)</span>
                      <span className="font-bold text-ink">{car.powerKw} – 320 кВт</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-[#f8fafc]">
                      <span className="text-[#64748b]">Хамгийн их эргүүлэх момент</span>
                      <span className="font-bold text-ink">310 – 500 Н·м</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-[#f8fafc]">
                      <span className="text-[#64748b]">0 – 100 км/ц хурдатгал</span>
                      <span className="font-bold text-ink">{car.acceleration}</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-[#64748b]">Хамгийн их хурд</span>
                      <span className="font-bold text-ink">160 км/ц</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Dimension Schematics & Systems */}
              <div className="space-y-8">
                {/* Dimension Schematics Card */}
                <div className="rounded-2xl border border-[#e2e8f0] bg-white p-6 shadow-sm">
                  <h3 className="text-[16px] font-bold text-ink mb-4 border-b border-[#f1f5f9] pb-3">
                    Хэмжээсийн зураг
                  </h3>
                  <div className="space-y-6">
                    {/* Front & Rear */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center">
                        <div className="relative aspect-[4/3] rounded-lg overflow-hidden bg-[#f8fafc] border border-[#e2e8f0]">
                          <Image src={car.image} alt="Front" fill className="object-contain p-2" />
                        </div>
                        <span className="text-[11px] font-bold text-[#64748b] mt-1 block">1,875 мм</span>
                      </div>
                      <div className="text-center">
                        <div className="relative aspect-[4/3] rounded-lg overflow-hidden bg-[#f8fafc] border border-[#e2e8f0]">
                          <Image src={car.image} alt="Rear" fill className="object-contain p-2" />
                        </div>
                        <span className="text-[11px] font-bold text-[#64748b] mt-1 block">1,875 мм (Өндөр 1,645 мм)</span>
                      </div>
                    </div>

                    {/* Side Profile */}
                    <div className="text-center">
                      <div className="relative aspect-[16/8] rounded-lg overflow-hidden bg-[#f8fafc] border border-[#e2e8f0]">
                        <Image src={car.image} alt="Side" fill className="object-contain p-2" />
                      </div>
                      <span className="text-[11px] font-bold text-[#64748b] mt-1 block">
                        Тэнхлэг: 2,765 мм | Нийт урт: 4,600 мм
                      </span>
                    </div>
                  </div>
                </div>

                {/* Батерей ба цэнэглэлт */}
                <div className="rounded-2xl border border-[#e2e8f0] bg-white p-6 shadow-sm">
                  <h3 className="text-[16px] font-bold text-ink mb-4 border-b border-[#f1f5f9] pb-3">
                    Батерей ба цэнэглэлт
                  </h3>
                  <div className="space-y-3 text-[13px]">
                    <div className="flex justify-between py-1 border-b border-[#f8fafc]">
                      <span className="text-[#64748b]">Батарейн багтаамж</span>
                      <span className="font-bold text-ink">49.9 / 66.7 кВт·ц</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-[#f8fafc]">
                      <span className="text-[#64748b]">Явалтын цэнэг (WLTP)</span>
                      <span className="font-bold text-ink">{car.rangeLabel || "430 – 610 км"}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-[#f8fafc]">
                      <span className="text-[#64748b]">Хурдан цэнэглэлт (DC)</span>
                      <span className="font-bold text-ink">10% – 80% (30 мин)</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-[#f8fafc]">
                      <span className="text-[#64748b]">Энгийн цэнэглэлт (AC)</span>
                      <span className="font-bold text-ink">0% – 100% (6.5 – 9 цаг)</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-[#64748b]">Цэнэглэгчийн төрөл</span>
                      <span className="font-bold text-ink">GB/T / CCS2</span>
                    </div>
                  </div>
                </div>

                {/* Аюулгүй байдал */}
                <div className="rounded-2xl border border-[#e2e8f0] bg-white p-6 shadow-sm">
                  <h3 className="text-[16px] font-bold text-ink mb-4 border-b border-[#f1f5f9] pb-3">
                    Аюулгүй байдал
                  </h3>
                  <div className="space-y-3 text-[13px]">
                    <div className="flex justify-between py-1 border-b border-[#f8fafc]">
                      <span className="text-[#64748b]">Safety Sense систем</span>
                      <span className="font-bold text-emerald-600">✓ Тийм</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-[#f8fafc]">
                      <span className="text-[#64748b]">Агаарын дэр</span>
                      <span className="font-bold text-ink">7</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-[#f8fafc]">
                      <span className="text-[#64748b]">360° Панорама камер</span>
                      <span className="font-bold text-emerald-600">✓ Тийм</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-[#f8fafc]">
                      <span className="text-[#64748b]">Ухаалаг жолоодлогын туслах</span>
                      <span className="font-bold text-emerald-600">✓ Тийм</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-[#64748b]">Замын тэмдэг таних</span>
                      <span className="font-bold text-emerald-600">✓ Тийм</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Actions Bar */}
            <div className="rounded-2xl bg-[#0c121d] p-8 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div>
                <h3 className="text-2xl font-extrabold text-white">
                  {car.name}-ийг өөрийн нүдээр мэдрээрэй
                </h3>
                <p className="text-sm text-white/70 mt-1">
                  Тест драйв захиалаад, шинэ үеийн цахилгаан жолоодлогыг мэдрээрэй.
                </p>
                <div className="mt-4 flex flex-wrap items-center gap-3">
                  <Link
                    href={`/contact?car=${car.slug}&type=testdrive`}
                    className="inline-flex h-10 items-center gap-2 rounded-xl bg-white px-5 text-[13px] font-bold text-[#0c121d] hover:bg-white/90"
                  >
                    <span>Тест драйв захиалах</span>
                    <span>→</span>
                  </Link>
                  <Link
                    href="/contact"
                    className="inline-flex h-10 items-center gap-2 rounded-xl border border-white/20 bg-white/5 px-5 text-[13px] font-medium text-white hover:bg-white/10"
                  >
                    <span>Холбоо барих</span>
                    <span>→</span>
                  </Link>
                </div>
              </div>

              <div className="flex flex-col gap-2 text-[13px]">
                <a href="#" className="flex items-center gap-2 text-white/80 hover:text-white">
                  <span>📄 Үзүүлэлтийн PDF татах</span>
                </a>
                <Link href="/inventory" className="flex items-center gap-2 text-white/80 hover:text-white">
                  <span>⚖️ Өөр загвартай харьцуулах</span>
                </Link>
                <Link href="/contact" className="flex items-center gap-2 text-white/80 hover:text-white">
                  <span>💬 Асуулт илгээх</span>
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB: ГАЛЛЕРЕЙ (GALLERY) */}
        {/* ============================================================== */}
        {currentTab === "gallery" && (
          <div className="space-y-12">
            {/* Gallery Filter Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="text-2xl font-bold tracking-tight text-ink">
                  {tabConfig.gallery.title}
                </h3>
                <p className="mt-1 text-[13px] text-[#64748b]">
                  {tabConfig.gallery.subtitle}
                </p>
              </div>

              {/* Category Pills */}
              <div className="flex flex-wrap items-center gap-2">
                {[
                  { id: "all", label: "Бүгд" },
                  { id: "exterior", label: "Экстерьер" },
                  { id: "interior", label: "Интерьер" },
                  { id: "detail", label: "Деталь" },
                  { id: "lifestyle", label: "Амьдралын хэв маяг" },
                ].map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setGalleryFilter(f.id)}
                    className={`rounded-lg px-3.5 py-1.5 text-[12px] font-bold transition-all ${
                      galleryFilter === f.id
                        ? "bg-[#0c121d] text-white shadow-sm"
                        : "border border-[#e2e8f0] bg-white text-[#64748b] hover:text-ink hover:border-[#0c121d]"
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Photo Grid */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {filteredGallery.slice(0, 2).map((item, i) => (
                <div
                  key={i}
                  className="group relative aspect-[16/10] sm:col-span-2 overflow-hidden rounded-2xl bg-[#0c121d] shadow-sm border border-[#e2e8f0]"
                >
                  <Image
                    src={item.src}
                    alt={item.caption}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <span className="inline-block rounded-md bg-white/20 backdrop-blur-sm px-2.5 py-0.5 text-[10px] font-bold text-white uppercase tracking-wider mb-1">
                      {item.tag}
                    </span>
                    <p className="text-[13px] font-medium text-white/90 leading-snug">
                      {item.caption}
                    </p>
                  </div>
                </div>
              ))}

              {filteredGallery.slice(2).map((item, i) => (
                <div
                  key={i + 2}
                  className="group relative aspect-[16/11] overflow-hidden rounded-2xl bg-[#0c121d] shadow-sm border border-[#e2e8f0]"
                >
                  <Image
                    src={item.src}
                    alt={item.caption}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
                  <div className="absolute bottom-3 left-3 right-3">
                    <span className="inline-block rounded bg-white/20 backdrop-blur-sm px-2 py-0.5 text-[9px] font-bold text-white uppercase tracking-wider mb-1">
                      {item.tag}
                    </span>
                    <p className="text-[11px] font-medium text-white/90 line-clamp-1">
                      {item.caption}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Video Showcase Section */}
            <div className="pt-6">
              <h3 className="text-xl font-bold tracking-tight text-ink mb-4">
                Видео
              </h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                {[
                  {
                    title: `${car.name} - Жолоодлогын туршлага`,
                    duration: "02:18",
                    img: car.image,
                  },
                  {
                    title: "Интерьер танилцуулга",
                    duration: "01:45",
                    img: car.image,
                  },
                  {
                    title: "Технологи ба аюулгүй байдал",
                    duration: "01:52",
                    img: car.image,
                  },
                ].map((vid, idx) => (
                  <div
                    key={idx}
                    onClick={() => setActiveVideoModal(vid.title)}
                    className="group relative aspect-[16/10] cursor-pointer overflow-hidden rounded-2xl bg-[#0c121d] shadow-sm border border-[#e2e8f0]"
                  >
                    <Image
                      src={vid.img}
                      alt={vid.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105 opacity-85"
                    />
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors" />

                    <div className="absolute inset-0 m-auto flex h-12 w-12 items-center justify-center rounded-full bg-white/30 backdrop-blur-md text-white transition-transform group-hover:scale-110 shadow-lg border border-white/40">
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <polygon points="5 3 19 12 5 21 5 3" />
                      </svg>
                    </div>

                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-[12px] font-bold">
                      <span className="drop-shadow-sm">{vid.title}</span>
                      <span className="rounded bg-black/60 px-2 py-0.5 text-[10px] backdrop-blur-sm">
                        {vid.duration}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Test Drive CTA Card */}
            <div className="relative overflow-hidden rounded-2xl bg-[#0c121d] p-8 text-white shadow-xl">
              <div className="absolute inset-0 opacity-30">
                <Image
                  src={car.image}
                  alt={car.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div>
                  <h3 className="text-2xl font-extrabold text-white">
                    {car.name}-ийг өөрийн нүдээр мэдрээрэй
                  </h3>
                  <p className="text-sm text-white/70 mt-1">
                    Шоурумд ирж туршилтын жолоодлого хийх цагаа захиалаарай.
                  </p>
                </div>
                <Link
                  href={`/contact?car=${car.slug}&type=testdrive`}
                  className="inline-flex h-11 items-center gap-2 rounded-xl bg-white px-6 text-[13px] font-bold text-[#0c121d] shadow-sm hover:bg-white/90 active:scale-95"
                >
                  <span>Тест драйв захиалах</span>
                  <span>→</span>
                </Link>
              </div>
            </div>
          </div>
        )}

        {currentTab !== "technology" && currentTab !== "interior" && currentTab !== "design" && (
        <div className="mt-16 border-t border-[#e2e8f0] pt-10">
          <div className="mb-6 flex items-center justify-between">
            <h3 className="text-xl font-bold tracking-tight text-ink">
              Ижил ангиллын автомашинууд
            </h3>
            <Link
              href="/inventory"
              className="inline-flex items-center gap-1 text-[13px] font-semibold text-ink hover:underline"
            >
              <span>Бүгдийг үзэх</span>
              <span>→</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {similar.map((item) => (
              <CarCard key={item.uuid || item.slug} car={item} />
            ))}
          </div>
        </div>
        )}
      </div>

      {activeVideoModal && (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-black/80 p-6"
          onClick={() => setActiveVideoModal(null)}
        >
          <div
            className="relative w-full max-w-3xl overflow-hidden rounded-2xl bg-[#0b1220]"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="relative aspect-video">
              <Image
                src={interiorHero}
                alt={activeVideoModal}
                fill
                className="object-cover"
                sizes="800px"
              />
              <div className="absolute inset-0 grid place-items-center bg-black/30">
                <span className="grid h-16 w-16 place-items-center rounded-full bg-white/90 text-[#0b1220]">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                    <polygon points="8 5 20 12 8 19 8 5" />
                  </svg>
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between px-5 py-4 text-white">
              <p className="text-sm font-semibold">{activeVideoModal} — Интерьер</p>
              <button
                type="button"
                onClick={() => setActiveVideoModal(null)}
                className="text-sm text-white/70 hover:text-white"
              >
                Хаах
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
