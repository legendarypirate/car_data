"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { type Car } from "@/data/cars";
import { BrandLogo } from "@/components/BrandLogo";
import { CarCard } from "@/components/CarCard";
import { CarDetailTechnology } from "@/components/CarDetailTechnology";
import { CarDetailInterior, interiorHeroSrc } from "@/components/CarDetailInterior";
import { CarDetailDesign, DesignHeroCopy } from "@/components/CarDetailDesign";
import { CarDetailOverview, OverviewHeroCopy } from "@/components/CarDetailOverview";
import { CarDetailSpecs } from "@/components/CarDetailSpecs";
import { KhanBankLoanButton } from "@/components/KhanBankLoanButton";
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
  const [activeVideoModal, setActiveVideoModal] = useState<string | null>(null);
  const currentTab = tabs.some((tab) => tab.id === activeTab) ? activeTab : firstTab;
  const interiorHero = interiorHeroSrc(car);

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
                {(tabConfig.interior.subtitle || tabConfig.overview.heroLine) && (
                  <p className="mt-3 max-w-md text-[16px] text-white/80">
                    {tabConfig.interior.subtitle || tabConfig.overview.heroLine}
                  </p>
                )}
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

          <div className="hidden shrink-0 items-center gap-2 sm:flex">
            <KhanBankLoanButton
              car={car.slug}
              price={car.price}
              variant="blue"
              className="h-10"
            />
            <Link
              href={`/contact?car=${car.slug}&type=testdrive`}
              className="inline-flex h-10 items-center gap-2 rounded-xl bg-[#0b1220] px-4 text-[13px] font-semibold text-white hover:bg-[#1e293b]"
            >
              Тест драйв захиалах <span>→</span>
            </Link>
          </div>
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
        {currentTab === "specs" && <CarDetailSpecs car={car} />}

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
            {filteredGallery.length === 0 ? (
              <p className="rounded-2xl border border-dashed border-[#e2e8f0] px-6 py-16 text-center text-sm text-[#64748b]">
                Галлерейн зураг алга.
              </p>
            ) : (
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
            )}

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
