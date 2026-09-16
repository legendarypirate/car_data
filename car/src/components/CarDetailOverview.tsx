"use client";

import Image from "next/image";
import Link from "next/link";
import type { Car } from "@/data/cars";
import { formatPrice, statusCopy } from "@/lib/format";
import { CarDetailFinancing } from "@/components/CarDetailFinancing";
import { InquiryForm } from "@/components/InquiryForm";
import { KhanBankLoanButton } from "@/components/KhanBankLoanButton";
import { mergeCarTabs } from "@/lib/car-tabs";
import { interiorHeroSrc } from "@/components/CarDetailInterior";

type JumpTab = "design" | "interior" | "technology";

export function OverviewHeroCopy({ car }: { car: Car }) {
  const tabs = mergeCarTabs(car.tabs);
  return (
    <>
      {(tabs.overview.heroLine || car.bodyLabel) && (
        <p className="mt-3 text-[18px] text-white/90">{tabs.overview.heroLine || car.bodyLabel}</p>
      )}
      {tabs.overview.heroText && (
        <p className="mt-4 max-w-md text-[14px] leading-7 text-white/70">{tabs.overview.heroText}</p>
      )}
      <p className="mt-5 text-[22px] font-semibold tracking-tight">
        {formatPrice(car.price)}{" "}
        <span className="text-[13px] font-normal text-white/55">~ эхс</span>
      </p>
      <div className="mt-6 flex flex-wrap items-center gap-3">
        <Link
          href={`/contact?car=${car.slug}`}
          className="inline-flex h-11 items-center gap-2 rounded-xl bg-white px-5 text-[13px] font-semibold text-[#0f172a] hover:bg-white/90"
        >
          Захиалга өгөх <span>→</span>
        </Link>
        <Link
          href={`/contact?car=${car.slug}&type=testdrive`}
          className="inline-flex h-11 items-center gap-2 rounded-xl border border-white/30 px-5 text-[13px] font-medium text-white hover:bg-white/10"
        >
          Тест драйв захиалах
        </Link>
        <KhanBankLoanButton car={car.slug} price={car.price} variant="blue" />
      </div>
    </>
  );
}

export function CarDetailOverview({
  car,
  onOpenTab,
}: {
  car: Car;
  onOpenTab: (tab: JumpTab) => void;
}) {
  const tabs = mergeCarTabs(car.tabs);
  const shortName = car.name.replace(new RegExp(`^${car.brand}\\s+`, "i"), "");
  const stats = [
    { value: car.rangeLabel || `${car.rangeKm} км`, label: "Нэг цэнэгээр" },
    { value: `${car.batteryKwh ?? "—"} кВт·ц`, label: "Батерейн багтаамж" },
    { value: car.acceleration, label: "0–100 км/ц" },
    { value: `${car.powerKw} кВт`, label: "Хүчин чадал" },
  ];

  const journeys: Array<{
    tab: JumpTab;
    kicker: string;
    title: string;
    copy: string;
    image: string;
  }> = (
    [
      {
        tab: "design" as const,
        kicker: tabs.design.label,
        title: tabs.design.title,
        copy: tabs.design.subtitle,
        image: car.image,
      },
      {
        tab: "interior" as const,
        kicker: tabs.interior.label,
        title: tabs.interior.title,
        copy: tabs.interior.subtitle,
        image: interiorHeroSrc(car),
      },
      {
        tab: "technology" as const,
        kicker: tabs.technology.label,
        title: tabs.technology.title,
        copy: tabs.technology.subtitle,
        image: car.image,
      },
    ] satisfies Array<{
      tab: JumpTab;
      kicker: string;
      title: string;
      copy: string;
      image: string;
    }>
  ).filter((item) => tabs[item.tab].visible && (item.title || item.copy));

  return (
    <div className="space-y-12">
      <div className="grid items-end gap-8 lg:grid-cols-12">
        <div className="lg:col-span-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#94a3b8]">
            OVERVIEW
          </p>
          <h2 className="mt-2 text-[36px] font-bold leading-[1.15] tracking-tight text-[#0f172a] md:text-[42px]">
            {tabs.overview.heading || tabs.overview.title}
          </h2>
        </div>
        <p className="lg:col-span-6 text-[15px] leading-7 text-[#64748b] lg:text-right">
          {car.description} {statusCopy[car.status].detail(car)}. Үнэд тээвэр,
          гааль, НӨАТ, бэлтгэл ажил багтсан.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((item) => (
          <div
            key={item.label}
            className="rounded-[22px] border border-[#eef2f6] bg-white px-5 py-6 shadow-[0_8px_24px_rgba(15,23,42,0.04)]"
          >
            <p className="text-[28px] font-bold tracking-tight text-[#0f172a]">
              {item.value}
            </p>
            <p className="mt-1 text-[12px] text-[#94a3b8]">{item.label}</p>
          </div>
        ))}
      </div>

      <div className="relative overflow-hidden rounded-[28px] bg-[#0b1220]">
        <div className="relative min-h-[280px] md:min-h-[420px]">
          <Image
            src={car.image}
            alt={car.name}
            fill
            sizes="100vw"
            className="object-cover object-[70%_center]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#070b12] via-transparent to-transparent" />
          <div className="absolute bottom-6 left-6 right-6 flex flex-wrap items-end justify-between gap-4 text-white">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/55">
                {car.year} · {car.brand}
              </p>
              <p className="mt-1 text-[22px] font-semibold">{shortName}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {car.highlights.slice(0, 3).map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[12px] backdrop-blur-sm"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

        {journeys.length > 0 && (
          <div className="grid gap-4 lg:grid-cols-3">
            {journeys.map((item) => (
              <button
                key={item.tab}
                type="button"
                onClick={() => onOpenTab(item.tab)}
                className="group overflow-hidden rounded-[22px] border border-[#eef2f6] bg-white text-left shadow-[0_8px_24px_rgba(15,23,42,0.04)]"
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    sizes="(min-width: 1024px) 33vw, 100vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                  />
                </div>
                <div className="p-5">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#94a3b8]">
                    {item.kicker}
                  </p>
                  <h3 className="mt-1 text-[18px] font-semibold text-[#0f172a]">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-[13px] leading-6 text-[#64748b]">{item.copy}</p>
                  <p className="mt-4 text-[13px] font-semibold text-[#0f172a]">
                    Дэлгэрэнгүй →
                  </p>
                </div>
              </button>
            ))}
          </div>
        )}

      <div className="grid items-stretch gap-6 lg:grid-cols-12">
        <div className="rounded-[28px] border border-[#eef2f6] bg-white p-7 shadow-[0_8px_24px_rgba(15,23,42,0.04)] lg:col-span-7">
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#94a3b8]">
            HIGHLIGHTS
          </p>
          <h3 className="mt-2 text-[26px] font-bold tracking-tight text-[#0f172a]">
            Яагаад энэ машиныг сонгох вэ
          </h3>
          <ul className="mt-6 space-y-4">
            {car.highlights.map((item) => (
              <li key={item} className="flex items-start gap-3 text-[15px] text-[#0f172a]">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[#0f172a]" />
                {item}
              </li>
            ))}
            <li className="flex items-start gap-3 text-[15px] text-[#0f172a]">
              <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[#0f172a]" />
              {car.seats} суудал · {car.drivetrain} · {car.color}
            </li>
          </ul>
        </div>

        <aside className="flex flex-col justify-between rounded-[28px] bg-[#0b1220] p-7 text-white lg:col-span-5">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/45">
              {statusCopy[car.status].label}
            </p>
            <p className="mt-3 text-[15px] text-white/70">
              {statusCopy[car.status].detail(car)}
            </p>
            <p className="mt-6 text-[32px] font-bold tracking-tight">
              {formatPrice(car.price)}
            </p>
            <p className="mt-1 text-[12px] text-white/45">
              Тээвэр, гааль, НӨАТ, бэлтгэл багтсан · ~ эхс
            </p>
          </div>
          <div className="mt-8 flex flex-col gap-3">
            <Link
              href={`/contact?car=${car.slug}`}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-white text-[13px] font-semibold text-[#0f172a] hover:bg-white/90"
            >
              Захиалга өгөх →
            </Link>
            <Link
              href={`/contact?car=${car.slug}&type=testdrive`}
              className="inline-flex h-11 items-center justify-center rounded-xl border border-white/20 text-[13px] font-medium hover:bg-white/10"
            >
              Тест драйв захиалах
            </Link>
            <KhanBankLoanButton car={car.slug} price={car.price} variant="blue" className="w-full" />
          </div>
        </aside>
      </div>

      <CarDetailFinancing
        carPrice={car.price}
        carName={car.name}
        carSlug={car.slug}
      />

      <section className="grid gap-8 rounded-[28px] border border-[#eef2f6] bg-white p-7 shadow-[0_8px_24px_rgba(15,23,42,0.04)] lg:grid-cols-12 lg:p-8">
        <div className="lg:col-span-5">
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#94a3b8]">
            CONTACT
          </p>
          <h3 className="mt-2 text-[26px] font-bold tracking-tight text-[#0f172a]">
            {shortName}-ийг шууд захиалах
          </h3>
          <p className="mt-3 text-[14px] leading-7 text-[#64748b]">
            Мэдээллээ үлдээснээр NDA AUTO-ийн зөвлөх холбогдож, хүргэлт болон
            санхүүжилтийг тохируулна.
          </p>
        </div>
        <div className="lg:col-span-7">
          <InquiryForm defaultCar={car.slug} />
        </div>
      </section>

      <section className="relative overflow-hidden rounded-[28px] px-7 py-12 text-white md:px-12 md:py-16">
        <Image src="/cta-scenic.jpg" alt="" fill sizes="100vw" className="object-cover" />
        <div className="absolute inset-0 bg-[#0b1220]/55" />
        <div className="relative z-10 flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
          <div>
            <h3 className="max-w-lg text-[32px] font-bold leading-tight tracking-tight md:text-[36px]">
              Ирээдүйн жолоодлого өнөөдрөөс эхэлнэ
            </h3>
            <p className="mt-3 text-[15px] text-white/80">
              {car.brand} {shortName} — Ухаалаг сонголт, илүү сайн ирээдүй.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href={`/contact?car=${car.slug}`}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-white px-5 text-[13px] font-semibold text-[#0f172a]"
            >
              Захиалга өгөх →
            </Link>
            <Link
              href={`/contact?car=${car.slug}&type=testdrive`}
              className="inline-flex h-11 items-center justify-center rounded-xl border border-white/30 px-5 text-[13px] font-medium"
            >
              Тест драйв захиалах
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
